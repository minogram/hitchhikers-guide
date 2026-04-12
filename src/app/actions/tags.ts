"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { cuidSchema } from "@/lib/definitions";

async function requireAdminOrManager() {
  const session = await auth();
  if (!session?.user || !["admin", "manager"].includes(session.user.role)) {
    return null;
  }
  return session;
}

export async function getTagOptionsWithIds() {
  const tags = await prisma.tagOption.findMany({
    orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
  });
  return {
    industry: tags.filter((t) => t.type === "industry").map((t) => ({ id: t.id, label: t.label })),
    process: tags.filter((t) => t.type === "process").map((t) => ({ id: t.id, label: t.label })),
  };
}

export async function getTagOptions() {
  const tags = await prisma.tagOption.findMany({
    orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
  });
  return {
    industry: tags.filter((t) => t.type === "industry").map((t) => t.label),
    process: tags.filter((t) => t.type === "process").map((t) => t.label),
  };
}

export async function addTagOption(label: string, group: "industry" | "process" = "industry") {
  const session = await requireAdminOrManager();
  if (!session) return { error: "권한이 없습니다." };

  const trimmed = label.trim();
  if (!trimmed) return { error: "태그 이름을 입력해주세요." };

  // New tag gets the highest sortOrder + 1
  const maxOrder = await prisma.tagOption.findFirst({
    where: { type: group },
    orderBy: { sortOrder: "desc" },
    select: { sortOrder: true },
  });
  const nextOrder = (maxOrder?.sortOrder ?? -1) + 1;

  try {
    await prisma.tagOption.create({ data: { type: group, label: trimmed, sortOrder: nextOrder } });
  } catch {
    return { error: "이미 존재하는 태그입니다." };
  }

  revalidatePath("/admin/tags");
  revalidatePath("/admin/apps/new");
  revalidatePath("/admin/apps");
  return { success: true };
}

export async function updateTagOption(id: string, newLabel: string) {
  const idResult = cuidSchema.safeParse(id);
  if (!idResult.success) return { error: "유효하지 않은 태그 ID입니다." };

  const session = await requireAdminOrManager();
  if (!session) return { error: "권한이 없습니다." };

  const trimmed = newLabel.trim();
  if (!trimmed) return { error: "태그 이름을 입력해주세요." };

  const existing = await prisma.tagOption.findUnique({ where: { id } });
  if (!existing) return { error: "태그를 찾을 수 없습니다." };

  const oldLabel = existing.label;
  if (oldLabel === trimmed) return { success: true };

  try {
    await prisma.$transaction(async (tx) => {
      await tx.tagOption.update({ where: { id }, data: { label: trimmed } });

      // Update all AppCards that reference the old tag label
      const apps = await tx.appCard.findMany({
        where: { tags: { contains: oldLabel } },
        select: { id: true, tags: true },
      });
      for (const app of apps) {
        const tags: string[] = JSON.parse(app.tags);
        const idx = tags.indexOf(oldLabel);
        if (idx !== -1) {
          tags[idx] = trimmed;
          await tx.appCard.update({ where: { id: app.id }, data: { tags: JSON.stringify(tags) } });
        }
      }
    });
  } catch {
    return { error: "태그 업데이트 중 오류가 발생했습니다." };
  }

  revalidatePath("/admin/tags");
  revalidatePath("/admin/apps");
  revalidatePath("/catalog");
  return { success: true };
}

export async function deleteTagOption(id: string) {
  const idResult = cuidSchema.safeParse(id);
  if (!idResult.success) return { error: "유효하지 않은 태그 ID입니다." };

  const session = await requireAdminOrManager();
  if (!session) return { error: "권한이 없습니다." };

  const existing = await prisma.tagOption.findUnique({ where: { id } });
  if (!existing) return { error: "태그를 찾을 수 없습니다." };

  const label = existing.label;

  try {
    await prisma.$transaction(async (tx) => {
      await tx.tagOption.delete({ where: { id } });

      // Remove the tag from all AppCards that reference it
      const apps = await tx.appCard.findMany({
        where: { tags: { contains: label } },
        select: { id: true, tags: true },
      });
      for (const app of apps) {
        const tags: string[] = JSON.parse(app.tags);
        const filtered = tags.filter((t) => t !== label);
        await tx.appCard.update({ where: { id: app.id }, data: { tags: JSON.stringify(filtered) } });
      }
    });
  } catch {
    return { error: "태그 삭제 중 오류가 발생했습니다." };
  }

  revalidatePath("/admin/tags");
  revalidatePath("/admin/apps");
  revalidatePath("/catalog");
  return { success: true };
}

export async function reorderTagOption(id: string, direction: "up" | "down") {
  const idResult = cuidSchema.safeParse(id);
  if (!idResult.success) return { error: "유효하지 않은 태그 ID입니다." };

  const session = await requireAdminOrManager();
  if (!session) return { error: "권한이 없습니다." };

  const current = await prisma.tagOption.findUnique({ where: { id } });
  if (!current) return { error: "태그를 찾을 수 없습니다." };

  // Find the neighbor to swap with
  const neighbor = await prisma.tagOption.findFirst({
    where: {
      type: current.type,
      sortOrder: direction === "up" ? { lt: current.sortOrder } : { gt: current.sortOrder },
    },
    orderBy: { sortOrder: direction === "up" ? "desc" : "asc" },
  });

  if (!neighbor) return { success: true }; // already at the edge

  // Swap sortOrder values
  await prisma.tagOption.update({ where: { id: current.id }, data: { sortOrder: neighbor.sortOrder } });
  await prisma.tagOption.update({ where: { id: neighbor.id }, data: { sortOrder: current.sortOrder } });

  revalidatePath("/admin/tags");
  revalidatePath("/admin/apps");
  revalidatePath("/catalog");
  return { success: true };
}
