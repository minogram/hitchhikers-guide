"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function toggleLike(appId: string): Promise<{ liked: boolean; likeCount: number }> {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("로그인이 필요합니다.");
  }
  const userId = session.user.id;

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
}
