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
  description: z.string().min(1, "설명을 입력해주세요."),
  detailDescription: z.string().optional(),
  link: z.string().url("유효한 URL을 입력해주세요."),
  industryTags: z.string().min(1, "산업 태그를 선택해주세요."),
  processTags: z.string().min(1, "공정 태그를 선택해주세요."),
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

  const industryTags = JSON.stringify(formData.getAll("industryTagsChecked"));
  const processTags = JSON.stringify(formData.getAll("processTagsChecked"));

  const validatedFields = AppFormSchema.safeParse({
    title: formData.get("title"),
    description: formData.get("description"),
    detailDescription: formData.get("detailDescription") || undefined,
    link: formData.get("link"),
    industryTags,
    processTags,
    hasGeminiDemo: formData.get("hasGeminiDemo") === "on",
  });

  if (!validatedFields.success) {
    return { errors: validatedFields.error.flatten().fieldErrors };
  }

  const data = validatedFields.data;

  const thumbnailUrl = (formData.get("thumbnail") as string | null)?.trim();

  await prisma.appCard.create({
    data: {
      title: data.title,
      description: data.description,
      detailDescription: data.detailDescription || null,
      link: data.link,
      industryTags: data.industryTags,
      processTags: data.processTags,
      hasGeminiDemo: data.hasGeminiDemo ?? false,
      createdBy: session.user.id,
      ...(thumbnailUrl ? { thumbnail: thumbnailUrl } : {}),
    },
  });

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

  const industryTags = JSON.stringify(formData.getAll("industryTagsChecked"));
  const processTags = JSON.stringify(formData.getAll("processTagsChecked"));

  const validatedFields = AppFormSchema.safeParse({
    title: formData.get("title"),
    description: formData.get("description"),
    detailDescription: formData.get("detailDescription") || undefined,
    link: formData.get("link"),
    industryTags,
    processTags,
    hasGeminiDemo: formData.get("hasGeminiDemo") === "on",
  });

  if (!validatedFields.success) {
    return { errors: validatedFields.error.flatten().fieldErrors };
  }

  const data = validatedFields.data;

  const thumbnailUrl = (formData.get("thumbnail") as string | null)?.trim();

  await prisma.appCard.update({
    where: { id: appId },
    data: {
      title: data.title,
      description: data.description,
      detailDescription: data.detailDescription || null,
      link: data.link,
      industryTags: data.industryTags,
      processTags: data.processTags,
      hasGeminiDemo: data.hasGeminiDemo ?? false,
      ...(thumbnailUrl ? { thumbnail: thumbnailUrl } : {}),
    },
  });

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
      await cloudinary.uploader.destroy(match[1]).catch(() => null);
    }
  }

  await prisma.appCard.delete({ where: { id: appId } });

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
  industryTags: string;
  processTags: string;
  hasGeminiDemo: boolean;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
  author: { name: string };
};

export async function getApps(): Promise<AdminApp[]> {
  return prisma.appCard.findMany({
    include: { author: { select: { name: true } } },
    orderBy: { createdAt: "desc" },
  });
}

export async function getAppById(id: string) {
  return prisma.appCard.findUnique({
    where: { id },
    include: { author: { select: { name: true } } },
  });
}
