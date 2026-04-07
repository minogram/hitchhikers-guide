import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const tags = await prisma.tagOption.findMany({
    orderBy: [{ createdAt: "asc" }],
  });
  return NextResponse.json({
    tags: tags.map((t) => t.label),
  });
}
