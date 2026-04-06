"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";

async function requireAdminOrManager() {
  const session = await auth();
  if (!session?.user || !["admin", "manager"].includes(session.user.role)) {
    return null;
  }
  return session;
}

export async function getTagOptions() {
  const tags = await prisma.tagOption.findMany({
    orderBy: [{ type: "asc" }, { createdAt: "asc" }],
  });
  const industry = tags.filter((t) => t.type === "industry").map((t) => t.label);
  const process = tags.filter((t) => t.type === "process").map((t) => t.label);
  return { industry, process };
}

export async function addTagOption(type: "industry" | "process", label: string) {
  const session = await requireAdminOrManager();
  if (!session) return { error: "권한이 없습니다." };

  const trimmed = label.trim();
  if (!trimmed) return { error: "태그 이름을 입력해주세요." };

  try {
    await prisma.tagOption.create({ data: { type, label: trimmed } });
  } catch {
    return { error: "이미 존재하는 태그입니다." };
  }

  revalidatePath("/admin/apps/new");
  revalidatePath("/admin/apps");
  return { success: true };
}
