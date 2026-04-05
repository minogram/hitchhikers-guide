"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function createComment(postId: string, content: string) {
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

  await prisma.comment.create({
    data: {
      content: content.trim(),
      postId,
      authorId: session.user.id!,
    },
  });

  revalidatePath(`/community/${postId}`);
  return { success: true };
}

export async function deleteComment(commentId: string) {
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

  await prisma.comment.delete({ where: { id: commentId } });

  revalidatePath(`/community/${comment.postId}`);
  return { success: true };
}
