import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { PostForm } from "../PostForm";
import { createPost } from "@/app/actions/posts";

export default async function NewPostPage() {
  const session = await auth();
  if (!session?.user) {
    redirect("/login");
  }

  return <PostForm action={createPost} />;
}
