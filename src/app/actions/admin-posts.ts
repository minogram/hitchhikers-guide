"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export type AdminPost = {
  id: string;
  type: string;
  title: string;
  isPinned: boolean;
  isVisible: boolean;
  authorId: string;
  createdAt: Date;
  author: { name: string };
  _count: { comments: number };
};

export async function getAdminPosts(): Promise<AdminPost[]> {
  const session = await auth();
  if (!session?.user || !["admin", "manager"].includes(session.user.role as string)) {
    return [];
  }

  return prisma.post.findMany({
    select: {
      id: true,
      type: true,
      title: true,
      isPinned: true,
      isVisible: true,
      authorId: true,
      createdAt: true,
      author: { select: { name: true } },
      _count: { select: { comments: true } },
    },
    orderBy: [{ isPinned: "desc" }, { createdAt: "desc" }],
  });
}

export async function togglePin(postId: string) {
  const session = await auth();
  if (!session?.user || !["admin", "manager"].includes(session.user.role as string)) {
    return { error: "권한이 없습니다." };
  }

  const post = await prisma.post.findUnique({ where: { id: postId } });
  if (!post) return { error: "게시글을 찾을 수 없습니다." };

  // Enforce max 3 pinned notices on the landing page
  if (post.type === "notice" && !post.isPinned) {
    const pinnedCount = await prisma.post.count({
      where: { type: "notice", isPinned: true },
    });
    if (pinnedCount >= 3) {
      return { error: "랜딩 페이지에 고정할 수 있는 공지는 최대 3개입니다." };
    }
  }

  try {
    await prisma.post.update({
      where: { id: postId },
      data: { isPinned: !post.isPinned },
    });
  } catch {
    return { error: "고정 상태 변경 중 오류가 발생했습니다." };
  }

  revalidatePath("/admin/posts");
  revalidatePath("/community");
  revalidatePath("/");
  return { success: true };
}

export async function togglePostVisibility(postId: string) {
  const session = await auth();
  if (!session?.user || !['admin', 'manager'].includes(session.user.role as string)) {
    return { error: '권한이 없습니다.' };
  }

  const post = await prisma.post.findUnique({ where: { id: postId }, select: { isVisible: true } });
  if (!post) return { error: '게시글을 찾을 수 없습니다.' };

  try {
    const updated = await prisma.post.update({
      where: { id: postId },
      data: { isVisible: !post.isVisible },
      select: { isVisible: true },
    });

    revalidatePath('/admin/posts');
    revalidatePath('/community');
    revalidatePath('/');
    return { isVisible: updated.isVisible };
  } catch {
    return { error: '노출 상태 변경 중 오류가 발생했습니다.' };
  }
}

export async function adminDeletePost(postId: string) {
  const session = await auth();
  if (!session?.user || !["admin", "manager"].includes(session.user.role as string)) {
    return { error: "권한이 없습니다." };
  }

  try {
    await prisma.post.delete({ where: { id: postId } });
  } catch {
    return { error: "게시글 삭제 중 오류가 발생했습니다." };
  }

  revalidatePath("/admin/posts");
  revalidatePath("/community");
  return { success: true };
}
