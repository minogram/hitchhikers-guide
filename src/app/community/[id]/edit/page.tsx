import { notFound, redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { updatePost } from "@/app/actions/posts";
import { EditPostForm } from "./EditPostForm";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EditPostPage({ params }: Props) {
  const { id } = await params;
  const session = await auth().catch(() => null);
  if (!session?.user) {
    redirect("/login");
  }

  const post = await prisma.post.findUnique({ where: { id } });
  if (!post) {
    notFound();
  }

  const role = session.user.role as string;
  const isOwner = post.authorId === session.user.id;
  const isPrivileged = role === "admin" || role === "manager";

  if (!isOwner && !isPrivileged) {
    redirect("/community");
  }

  return (
    <EditPostForm
      postId={id}
      action={updatePost}
      initialData={{
        type: post.type,
        title: post.title,
        content: post.content,
        isPinned: post.isPinned,
      }}
    />
  );
}
