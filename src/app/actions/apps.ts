"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import * as z from "zod";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const AppFormSchema = z.object({
  title: z.string().min(1, "앱 이름을 입력해주세요."),
  description: z.string().optional(),
  detailDescription: z.string().optional(),
  link: z.string().url("유효한 URL을 입력해주세요.").optional().or(z.literal("")),
  tags: z.string().min(1, "태그를 한 개 이상 선택해주세요."),
  hasGeminiDemo: z.boolean().optional(),
});

export type AppFormState = {
  errors?: Record<string, string[]>;
  message?: string;
  success?: boolean;
};

async function requireAdminOrManager() {
  const session = await auth();
  if (!session?.user || !["admin", "manager"].includes(session.user.role)) {
    return null;
  }
  return session;
}

export async function createApp(
  _prevState: AppFormState | undefined,
  formData: FormData
): Promise<AppFormState> {
  const session = await requireAdminOrManager();
  if (!session) return { message: "권한이 없습니다." };

  const tags = JSON.stringify(formData.getAll("tagsChecked"));

  const validatedFields = AppFormSchema.safeParse({
    title: formData.get("title"),
    description: formData.get("description"),
    detailDescription: formData.get("detailDescription") || undefined,
    link: formData.get("link"),
    tags,
    hasGeminiDemo: formData.get("hasGeminiDemo") === "on",
  });

  if (!validatedFields.success) {
    return { errors: validatedFields.error.flatten().fieldErrors };
  }

  const data = validatedFields.data;

  const thumbnailUrl = (formData.get("thumbnail") as string | null)?.trim();

  const isVisible = formData.get("isVisible") === "on";

  await prisma.appCard.create({
    data: {
      title: data.title,
      description: data.description || "",
      detailDescription: data.detailDescription || null,
      link: data.link || "",
      tags: data.tags,
      hasGeminiDemo: data.hasGeminiDemo ?? false,
      isVisible,
      createdBy: session.user.id,
      ...(thumbnailUrl ? { thumbnail: thumbnailUrl } : {}),
    },
  });

  revalidatePath("/");
  revalidatePath("/catalog");
  revalidatePath("/admin/apps");
  return { success: true, message: "앱이 등록되었습니다." };
}

export async function updateApp(
  appId: string,
  _prevState: AppFormState | undefined,
  formData: FormData
): Promise<AppFormState> {
  const session = await requireAdminOrManager();
  if (!session) return { message: "권한이 없습니다." };

  const tags = JSON.stringify(formData.getAll("tagsChecked"));

  const validatedFields = AppFormSchema.safeParse({
    title: formData.get("title"),
    description: formData.get("description"),
    detailDescription: formData.get("detailDescription") || undefined,
    link: formData.get("link"),
    tags,
    hasGeminiDemo: formData.get("hasGeminiDemo") === "on",
  });

  if (!validatedFields.success) {
    return { errors: validatedFields.error.flatten().fieldErrors };
  }

  const data = validatedFields.data;

  const thumbnailUrl = (formData.get("thumbnail") as string | null)?.trim();

  // 썸네일이 변경된 경우 기존 Cloudinary 이미지 삭제
  if (thumbnailUrl) {
    const existing = await prisma.appCard.findUnique({
      where: { id: appId },
      select: { thumbnail: true },
    });
    if (existing?.thumbnail && existing.thumbnail !== thumbnailUrl) {
      const match = existing.thumbnail.match(/\/upload\/(?:v\d+\/)?(.+)\.[^.]+$/);
      if (match) {
        await cloudinary.uploader.destroy(match[1]).catch((err: unknown) => {
          console.error("Cloudinary delete failed (update):", err);
        });
      }
    }
  }

  const isVisible = formData.get("isVisible") === "on";

  await prisma.appCard.update({
    where: { id: appId },
    data: {
      title: data.title,
      description: data.description || "",
      detailDescription: data.detailDescription || null,
      link: data.link || "",
      tags: data.tags,
      hasGeminiDemo: data.hasGeminiDemo ?? false,
      isVisible,
      ...(thumbnailUrl ? { thumbnail: thumbnailUrl } : {}),
    },
  });

  revalidatePath("/");
  revalidatePath("/catalog");
  revalidatePath("/admin/apps");
  return { success: true, message: "앱이 수정되었습니다." };
}

export async function deleteApp(appId: string) {
  const session = await requireAdminOrManager();
  if (!session) return { error: "권한이 없습니다." };

  const app = await prisma.appCard.findUnique({ where: { id: appId } });

  if (app?.thumbnail) {
    // URL에서 public_id 추출: .../upload/v123456/{public_id}.ext
    const match = app.thumbnail.match(/\/upload\/(?:v\d+\/)?(.+)\.[^.]+$/);
    if (match) {
      await cloudinary.uploader.destroy(match[1]).catch((err: unknown) => {
        console.error("Cloudinary delete failed (delete):", err);
      });
    }
  }

  await prisma.appCard.delete({ where: { id: appId } });

  revalidatePath("/");
  revalidatePath("/catalog");
  revalidatePath("/admin/apps");
  return { success: true };
}

export type AdminApp = {
  id: string;
  title: string;
  thumbnail: string;
  description: string;
  detailDescription: string | null;
  link: string;
  tags: string;
  hasGeminiDemo: boolean;
  isVisible: boolean;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
  author: { name: string };
  _count: { likes: number };
};

export async function getApps(): Promise<AdminApp[]> {
  return prisma.appCard.findMany({
    include: {
      author: { select: { name: true } },
      _count: { select: { likes: true } },
    },
    orderBy: { createdAt: "desc" },
  });
}

export async function getAppById(id: string) {
  return prisma.appCard.findUnique({
    where: { id },
    include: { author: { select: { name: true } } },
  });
}

export async function toggleAppVisibility(appId: string): Promise<{ error?: string; isVisible?: boolean }> {
  const session = await requireAdminOrManager();
  if (!session) return { error: "권한이 없습니다." };

  const app = await prisma.appCard.findUnique({ where: { id: appId }, select: { isVisible: true } });
  if (!app) return { error: "앱을 찾을 수 없습니다." };

  const updated = await prisma.appCard.update({
    where: { id: appId },
    data: { isVisible: !app.isVisible },
    select: { isVisible: true },
  });

  revalidatePath("/");
  revalidatePath("/catalog");
  revalidatePath("/admin/apps");
  return { isVisible: updated.isVisible };
}

export async function bulkSetAppVisibility(
  appIds: string[],
  visible: boolean
): Promise<{ error?: string; updatedIds?: string[] }> {
  const session = await requireAdminOrManager();
  if (!session) return { error: "권한이 없습니다." };
  if (!appIds.length) return { error: "선택된 앱이 없습니다." };
  if (appIds.length > 100) return { error: "한 번에 최대 100개까지 처리할 수 있습니다." };

  await prisma.appCard.updateMany({
    where: { id: { in: appIds } },
    data: { isVisible: visible },
  });

  revalidatePath("/");
  revalidatePath("/catalog");
  revalidatePath("/admin/apps");
  return { updatedIds: appIds };
}

export type ImportResult = {
  error?: string;
  created?: number;
  skipped?: number;
  skippedTitles?: string[];
};

export async function importAppsFromJson(jsonText: string): Promise<ImportResult> {
  const session = await requireAdminOrManager();
  if (!session) return { error: "권한이 없습니다." };

  let rawData: unknown;
  try {
    rawData = JSON.parse(jsonText);
  } catch {
    return { error: "JSON 형식이 올바르지 않습니다." };
  }

  if (!Array.isArray(rawData)) return { error: "apps.json 형식이 올바르지 않습니다." };

  const existingTitles = new Set(
    (await prisma.appCard.findMany({ select: { title: true } })).map((a) => a.title)
  );

  let created = 0;
  const skippedTitles: string[] = [];

  for (const item of rawData) {
    const title = String(item.title ?? "").trim();
    if (!title) continue;

    if (existingTitles.has(title)) {
      skippedTitles.push(title);
      continue;
    }

    const tags = JSON.stringify(Array.isArray(item.tags) ? item.tags : [...(Array.isArray(item.industry) ? item.industry : []), ...(Array.isArray(item.process) ? item.process : [])]);
    const link = String(item.url ?? "").trim();
    const description = String(item.short_description ?? "").trim();
    const detailDescription = String(item.description ?? "").trim() || null;

    await prisma.appCard.create({
      data: {
        title,
        description,
        detailDescription,
        link,
        tags,
        hasGeminiDemo: false,
        isVisible: true,
        createdBy: session.user.id,
      },
    });

    existingTitles.add(title);
    created++;
  }

  revalidatePath("/");
  revalidatePath("/catalog");
  revalidatePath("/admin/apps");
  return { created, skipped: skippedTitles.length, skippedTitles };
}
