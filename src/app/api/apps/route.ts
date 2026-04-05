import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const apps = await prisma.appCard.findMany({
    orderBy: { createdAt: "desc" },
  });

  const formatted = apps.map((app) => ({
    id: app.id,
    title: app.title,
    thumbnail: app.thumbnail,
    description: app.description,
    industryTags: JSON.parse(app.industryTags),
    processTags: JSON.parse(app.processTags),
    hasGeminiDemo: app.hasGeminiDemo,
  }));

  return NextResponse.json(formatted);
}
