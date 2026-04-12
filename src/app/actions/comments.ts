"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { cuidSchema } from "@/lib/definitions";

export async function createComment(postId: string, content: string) {
  const idResult = cuidSchema.safeParse(postId);
  if (!idResult.success) return { error: "유효하지 않은 게시글 ID입니다." };

  const session = await auth();
  if (!session?.user) {
    return { error: "로그인이 필요합니다." };
  }

  if (!content || content.trim().length === 0) {
    return { error: "댓글 내용을 입력해주세요." };
  }

  if (content.length > 2000) {
    return { error: "댓글은 2000자 이내로 작성해주세요." };
  }

  const post = await prisma.post.findUnique({ where: { id: postId }, select: { id: true } });
  if (!post) {
    return { error: "게시글을 찾을 수 없습니다." };
  }

  try {
    await prisma.comment.create({
      data: {
        content: content.trim(),
        postId,
        authorId: session.user.id!,
      },
    });
  } catch {
    return { error: "댓글 작성 중 오류가 발생했습니다." };
  }

  revalidatePath(`/community/${postId}`);
  return { success: true };
}

export async function deleteComment(commentId: string) {
  const idResult = cuidSchema.safeParse(commentId);
  if (!idResult.success) return { error: "유효하지 않은 댓글 ID입니다." };

  const session = await auth();
  if (!session?.user) {
    return { error: "로그인이 필요합니다." };
  }

  const comment = await prisma.comment.findUnique({
    where: { id: commentId },
  });

  if (!comment) {
    return { error: "댓글을 찾을 수 없습니다." };
  }

  const role = session.user.role as string;
  const isOwner = comment.authorId === session.user.id;
  const isPrivileged = role === "admin" || role === "manager";

  if (!isOwner && !isPrivileged) {
    return { error: "삭제 권한이 없습니다." };
  }

  try {
    await prisma.comment.delete({ where: { id: commentId } });
  } catch {
    return { error: "댓글 삭제 중 오류가 발생했습니다." };
  }

  revalidatePath(`/community/${comment.postId}`);
  return { success: true };
}
