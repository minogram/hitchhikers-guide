"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function updateUserRole(userId: string, newRole: string) {
  const session = await auth();
  if (!session?.user || session.user.role !== "admin") {
    return { error: "권한이 없습니다." };
  }

  // Prevent changing own role
  if (session.user.id === userId) {
    return { error: "자신의 등급은 변경할 수 없습니다." };
  }

  if (!["user", "manager"].includes(newRole)) {
    return { error: "유효하지 않은 등급입니다." };
  }

  try {
    await prisma.user.update({
      where: { id: userId },
      data: { role: newRole },
    });
  } catch {
    return { error: "등급 변경 중 오류가 발생했습니다." };
  }

  revalidatePath("/admin/users");
  return { success: true };
}

export type AdminUser = {
  id: string;
  name: string;
  email: string;
  role: string;
  createdAt: Date;
};

export async function getUsers(): Promise<AdminUser[]> {
  const session = await auth();
  if (!session?.user || session.user.role !== "admin") {
    return [];
  }

  return prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true,
    },
    orderBy: { createdAt: "desc" },
  });
}

export async function deleteUser(userId: string) {
  const session = await auth();
  if (!session?.user || session.user.role !== "admin") {
    return { error: "권한이 없습니다." };
  }

  if (session.user.id === userId) {
    return { error: "자신의 계정은 삭제할 수 없습니다." };
  }

  const target = await prisma.user.findUnique({ where: { id: userId }, select: { role: true } });
  if (!target) {
    return { error: "존재하지 않는 사용자입니다." };
  }
  if (target.role === "admin") {
    return { error: "관리자 계정은 삭제할 수 없습니다." };
  }

  try {
    await prisma.comment.deleteMany({ where: { authorId: userId } });
    await prisma.post.deleteMany({ where: { authorId: userId } });
    await prisma.appCard.deleteMany({ where: { createdBy: userId } });
    await prisma.user.delete({ where: { id: userId } });
  } catch {
    return { error: "사용자 삭제 중 오류가 발생했습니다." };
  }

  revalidatePath("/admin/users");
  return { success: true };
}

export async function getAdminStats() {
  const session = await auth();
  if (!session?.user || session.user.role !== "admin") {
    return null;
  }

  const [userCount, appCount, tagCount, postCount] = await Promise.all([
    prisma.user.count(),
    prisma.appCard.count({ where: { isVisible: true } }),
    prisma.tagOption.count(),
    prisma.post.count(),
  ]);

  return { userCount, appCount, tagCount, postCount };
}
