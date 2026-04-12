"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { cuidSchema } from "@/lib/definitions";

export async function toggleLike(appId: string): Promise<{ liked: boolean; likeCount: number } | { error: string }> {
  const idResult = cuidSchema.safeParse(appId);
  if (!idResult.success) return { error: "유효하지 않은 앱 ID입니다." };

  const session = await auth();
  if (!session?.user?.id) {
    return { error: "로그인이 필요합니다." };
  }
  const userId = session.user.id;

  const app = await prisma.appCard.findUnique({ where: { id: appId }, select: { id: true } });
  if (!app) {
    return { error: "앱을 찾을 수 없습니다." };
  }

  try {
    const existing = await prisma.appLike.findUnique({
      where: { userId_appId: { userId, appId } },
    });

    if (existing) {
      await prisma.appLike.delete({ where: { userId_appId: { userId, appId } } });
      const updated = await prisma.appCard.update({
        where: { id: appId },
        data: { likeCount: { decrement: 1 } },
        select: { likeCount: true },
      });
      revalidatePath(`/catalog/${appId}`);
      return { liked: false, likeCount: updated.likeCount };
    } else {
      await prisma.appLike.create({ data: { userId, appId } });
      const updated = await prisma.appCard.update({
        where: { id: appId },
        data: { likeCount: { increment: 1 } },
        select: { likeCount: true },
      });
      revalidatePath(`/catalog/${appId}`);
      return { liked: true, likeCount: updated.likeCount };
    }
  } catch {
    return { error: "좋아요 처리 중 오류가 발생했습니다." };
  }
}
