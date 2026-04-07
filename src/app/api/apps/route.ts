import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";

export async function GET() {
  const session = await auth().catch(() => null);
  const userId = session?.user?.id ?? null;

  const apps = await prisma.appCard.findMany({
    where: { isVisible: true },
    orderBy: { createdAt: "desc" },
    include: userId
      ? { likes: { where: { userId }, select: { userId: true } } }
      : undefined,
  });

  const formatted = apps.map((app) => ({
    id: app.id,
    title: app.title,
    thumbnail: app.thumbnail,
    description: app.description,
    industryTags: JSON.parse(app.industryTags),
    processTags: JSON.parse(app.processTags),
    hasGeminiDemo: app.hasGeminiDemo,
    likeCount: app.likeCount,
    isLiked: userId ? ((app as typeof app & { likes?: { userId: string }[] }).likes?.length ?? 0) > 0 : false,
  }));

  return NextResponse.json(formatted);
}
