import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const tags = await prisma.tagOption.findMany({
    orderBy: [{ createdAt: "asc" }],
  });
  const industry = tags.filter((t) => t.type === "industry").map((t) => t.label);
  const process = tags.filter((t) => t.type === "process").map((t) => t.label);
  return NextResponse.json({ industry, process });
}
