"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

const PostSchema = z.object({
  type: z.enum(["notice", "forum", "job", "article"]),
  title: z.string().min(1, "제목을 입력해주세요.").max(200),
  content: z.string().min(1, "내용을 입력해주세요."),
  isPinned: z.boolean().optional(),
});

export type PostFormState = {
  errors?: {
    type?: string[];
    title?: string[];
    content?: string[];
  };
  message?: string;
};

export async function createPost(
  _prevState: PostFormState | undefined,
  formData: FormData
): Promise<PostFormState> {
  const session = await auth();
  if (!session?.user) {
    return { message: "로그인이 필요합니다." };
  }

  const role = session.user.role as string;
  const type = formData.get("type") as string;

  // Role-based type restrictions
  if (type === "notice" && role !== "admin" && role !== "manager") {
    return { message: "공지사항은 관리자 또는 매니저만 작성할 수 있습니다." };
  }
  if (type === "article" && role !== "admin" && role !== "manager") {
    return { message: "아티클은 관리자 또는 매니저만 작성할 수 있습니다." };
  }

  const validated = PostSchema.safeParse({
    type,
    title: formData.get("title"),
    content: formData.get("content"),
    isPinned: formData.get("isPinned") === "on",
  });

  if (!validated.success) {
    return { errors: validated.error.flatten().fieldErrors };
  }

  const canPin = role === "admin" || role === "manager";

  try {
    await prisma.post.create({
      data: {
        type: validated.data.type,
        title: validated.data.title,
        content: validated.data.content,
        isPinned: canPin ? (validated.data.isPinned ?? false) : false,
        authorId: session.user.id!,
      },
    });
  } catch {
    return { message: "게시글 작성 중 오류가 발생했습니다." };
  }

  revalidatePath("/community");
  redirect("/community");
}

export async function updatePost(
  postId: string,
  _prevState: PostFormState | undefined,
  formData: FormData
): Promise<PostFormState> {
  const session = await auth();
  if (!session?.user) {
    return { message: "로그인이 필요합니다." };
  }

  const post = await prisma.post.findUnique({ where: { id: postId } });
  if (!post) {
    return { message: "게시글을 찾을 수 없습니다." };
  }

  const role = session.user.role as string;
  const isOwner = post.authorId === session.user.id;
  const isPrivileged = role === "admin" || role === "manager";

  // notice, article: 관리자/매니저만 수정 가능
  const adminOnlyTypes = ["notice", "article"];
  if (adminOnlyTypes.includes(post.type)) {
    if (!isPrivileged) {
      return { message: "수정 권한이 없습니다." };
    }
  } else {
    // forum, job: 본인 또는 관리자/매니저
    if (!isOwner && !isPrivileged) {
      return { message: "수정 권한이 없습니다." };
    }
  }

  const validated = PostSchema.safeParse({
    type: formData.get("type"),
    title: formData.get("title"),
    content: formData.get("content"),
    isPinned: formData.get("isPinned") === "on",
  });

  if (!validated.success) {
    return { errors: validated.error.flatten().fieldErrors };
  }

  try {
    await prisma.post.update({
      where: { id: postId },
      data: {
        title: validated.data.title,
        content: validated.data.content,
        isPinned: isPrivileged ? (validated.data.isPinned ?? false) : post.isPinned,
      },
    });
  } catch {
    return { message: "게시글 수정 중 오류가 발생했습니다." };
  }

  revalidatePath("/community");
  revalidatePath(`/community/${postId}`);
  redirect(`/community/${postId}`);
}

export async function deletePost(postId: string): Promise<{ message?: string }> {
  const session = await auth();
  if (!session?.user) {
    return { message: "로그인이 필요합니다." };
  }

  const post = await prisma.post.findUnique({ where: { id: postId } });
  if (!post) {
    return { message: "게시글을 찾을 수 없습니다." };
  }

  const role = session.user.role as string;
  const isOwner = post.authorId === session.user.id;
  const isPrivileged = role === "admin" || role === "manager";

  // notice, article: 관리자/매니저만 삭제 가능
  const adminOnlyTypes = ["notice", "article"];
  if (adminOnlyTypes.includes(post.type)) {
    if (!isPrivileged) {
      return { message: "삭제 권한이 없습니다." };
    }
  } else {
    // forum, job: 본인 또는 관리자/매니저
    if (!isOwner && !isPrivileged) {
      return { message: "삭제 권한이 없습니다." };
    }
  }

  try {
    await prisma.post.delete({ where: { id: postId } });
  } catch {
    return { message: "게시글 삭제 중 오류가 발생했습니다." };
  }

  revalidatePath("/community");
  redirect("/community");
}
