"use client";

import { PostForm } from "../../PostForm";
import type { PostFormState } from "@/app/actions/posts";

interface Props {
  postId: string;
  action: (
    postId: string,
    prevState: PostFormState | undefined,
    formData: FormData
  ) => Promise<PostFormState>;
  initialData: {
    type: string;
    title: string;
    content: string;
    isPinned: boolean;
  };
}

export function EditPostForm({ postId, action, initialData }: Props) {
  const boundAction = action.bind(null, postId);
  return <PostForm action={boundAction} initialData={initialData} isEdit />;
}
