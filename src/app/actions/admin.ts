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

  await prisma.user.update({
    where: { id: userId },
    data: { role: newRole },
  });

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

export async function getAdminStats() {
  const session = await auth();
  if (!session?.user || session.user.role !== "admin") {
    return null;
  }

  const [userCount, appCount, postCount, managerCount] = await Promise.all([
    prisma.user.count(),
    prisma.appCard.count(),
    prisma.post.count(),
    prisma.user.count({ where: { role: "manager" } }),
  ]);

  return { userCount, appCount, postCount, managerCount };
}
