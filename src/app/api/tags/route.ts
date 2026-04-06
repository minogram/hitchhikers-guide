import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const tags = await prisma.tagOption.findMany({
    orderBy: [{ type: "asc" }, { createdAt: "asc" }],
  });
  return NextResponse.json({
    industry: tags.filter((t) => t.type === "industry").map((t) => t.label),
    process: tags.filter((t) => t.type === "process").map((t) => t.label),
  });
}
