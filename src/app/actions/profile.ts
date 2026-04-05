"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { encrypt } from "@/lib/crypto";
import bcrypt from "bcryptjs";
import { z } from "zod";

export type ProfileFormState = {
  errors?: Record<string, string[]>;
  message?: string;
  success?: boolean;
};

const UpdateProfileSchema = z.object({
  name: z.string().min(2, "이름은 2자 이상이어야 합니다.").trim(),
  email: z.string().email("올바른 이메일을 입력해주세요.").trim(),
});

export async function updateProfile(
  _prevState: ProfileFormState | undefined,
  formData: FormData
): Promise<ProfileFormState> {
  const session = await auth();
  if (!session?.user?.id) {
    return { message: "로그인이 필요합니다." };
  }

  const validated = UpdateProfileSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
  });

  if (!validated.success) {
    return { errors: validated.error.flatten().fieldErrors };
  }

  const { name, email } = validated.data;

  // Check duplicate email (only if changed)
  if (email !== session.user.email) {
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return { errors: { email: ["이미 사용 중인 이메일입니다."] } };
    }
  }

  await prisma.user.update({
    where: { id: session.user.id },
    data: { name, email },
  });

  return { success: true, message: "프로필이 업데이트되었습니다." };
}

const ChangePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "현재 비밀번호를 입력해주세요."),
    newPassword: z
      .string()
      .min(8, "비밀번호는 8자 이상이어야 합니다.")
      .regex(/[a-zA-Z]/, "영문자를 1자 이상 포함해야 합니다.")
      .regex(/[0-9]/, "숫자를 1자 이상 포함해야 합니다."),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "비밀번호가 일치하지 않습니다.",
    path: ["confirmPassword"],
  });

export async function changePassword(
  _prevState: ProfileFormState | undefined,
  formData: FormData
): Promise<ProfileFormState> {
  const session = await auth();
  if (!session?.user?.id) {
    return { message: "로그인이 필요합니다." };
  }

  const validated = ChangePasswordSchema.safeParse({
    currentPassword: formData.get("currentPassword"),
    newPassword: formData.get("newPassword"),
    confirmPassword: formData.get("confirmPassword"),
  });

  if (!validated.success) {
    return { errors: validated.error.flatten().fieldErrors };
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
  });

  if (!user) {
    return { message: "사용자를 찾을 수 없습니다." };
  }

  const isValid = await bcrypt.compare(
    validated.data.currentPassword,
    user.password
  );

  if (!isValid) {
    return { errors: { currentPassword: ["현재 비밀번호가 올바르지 않습니다."] } };
  }

  const hashedPassword = await bcrypt.hash(validated.data.newPassword, 10);

  await prisma.user.update({
    where: { id: session.user.id },
    data: { password: hashedPassword },
  });

  return { success: true, message: "비밀번호가 변경되었습니다." };
}

export async function saveApiKey(
  _prevState: ProfileFormState | undefined,
  formData: FormData
): Promise<ProfileFormState> {
  const session = await auth();
  if (!session?.user?.id) {
    return { message: "로그인이 필요합니다." };
  }

  const apiKey = (formData.get("apiKey") as string)?.trim() ?? "";

  if (apiKey === "") {
    // Clear the key
    await prisma.user.update({
      where: { id: session.user.id },
      data: { geminiApiKey: null },
    });
    return { success: true, message: "API 키가 삭제되었습니다." };
  }

  // Basic format validation for Gemini API keys
  if (!apiKey.startsWith("AI") || apiKey.length < 20) {
    return {
      errors: { apiKey: ["올바른 Gemini API 키 형식이 아닙니다."] },
    };
  }

  const encrypted = encrypt(apiKey);

  await prisma.user.update({
    where: { id: session.user.id },
    data: { geminiApiKey: encrypted },
  });

  return { success: true, message: "API 키가 안전하게 저장되었습니다." };
}

export async function getMyProfile() {
  const session = await auth();
  if (!session?.user?.id) return null;

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      geminiApiKey: true,
      createdAt: true,
    },
  });

  if (!user) return null;

  return {
    ...user,
    hasApiKey: !!user.geminiApiKey,
    geminiApiKey: undefined, // Never expose the key to the client
  };
}

export async function deleteAccount(
  _prevState: ProfileFormState | undefined,
  formData: FormData
): Promise<ProfileFormState> {
  const session = await auth();
  if (!session?.user?.id) {
    return { message: "로그인이 필요합니다." };
  }

  const password = formData.get("password") as string;
  if (!password) {
    return { errors: { password: ["비밀번호를 입력해주세요."] } };
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
  });

  if (!user) {
    return { message: "사용자를 찾을 수 없습니다." };
  }

  if (user.role === "admin") {
    return { message: "관리자 계정은 탈퇴할 수 없습니다." };
  }

  const isValid = await bcrypt.compare(password, user.password);
  if (!isValid) {
    return { errors: { password: ["비밀번호가 올바르지 않습니다."] } };
  }

  // Delete user's comments, posts, then user
  await prisma.comment.deleteMany({ where: { authorId: user.id } });
  await prisma.post.deleteMany({ where: { authorId: user.id } });
  await prisma.user.delete({ where: { id: user.id } });

  return { success: true, message: "계정이 삭제되었습니다." };
}
