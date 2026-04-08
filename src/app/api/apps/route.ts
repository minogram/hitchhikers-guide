import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";

export async function GET() {
  const session = await auth().catch(() => null);
  const userId = session?.user?.id ?? null;

  const [apps, tagOptions] = await Promise.all([
    prisma.appCard.findMany({
      where: { isVisible: true },
      orderBy: { createdAt: "desc" },
      include: userId
        ? { likes: { where: { userId }, select: { userId: true } } }
        : undefined,
    }),
    prisma.tagOption.findMany({ select: { label: true, type: true } }),
  ]);

  const industrySet = new Set(tagOptions.filter((t) => t.type === "industry").map((t) => t.label));

  const formatted = apps.map((app) => {
    const tags: string[] = JSON.parse(app.tags);
    return {
      id: app.id,
      title: app.title,
      thumbnail: app.thumbnail,
      description: app.description,
      tags,
      industryTags: tags.filter((t) => industrySet.has(t)),
      processTags: tags.filter((t) => !industrySet.has(t)),
      hasGeminiDemo: app.hasGeminiDemo,
      likeCount: app.likeCount,
      isLiked: userId ? ((app as typeof app & { likes?: { userId: string }[] }).likes?.length ?? 0) > 0 : false,
    };
  });

  return NextResponse.json(formatted);
}
