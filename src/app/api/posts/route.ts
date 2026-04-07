import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const posts = await prisma.post.findMany({
    where: { isVisible: true },
    orderBy: [{ isPinned: "desc" }, { createdAt: "desc" }],
    include: {
      author: { select: { name: true } },
      _count: { select: { comments: true } },
    },
  });

  const result = posts.map((p) => ({
    id: p.id,
    type: p.type,
    title: p.title,
    content: p.content,
    authorId: p.authorId,
    authorName: p.author.name,
    isPinned: p.isPinned,
    createdAt: p.createdAt,
    updatedAt: p.updatedAt,
    commentCount: p._count.comments,
  }));

  return NextResponse.json(result);
}
