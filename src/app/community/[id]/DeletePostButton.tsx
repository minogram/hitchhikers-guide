"use client";

import { useState } from "react";
import { deletePost } from "@/app/actions/posts";

export function DeletePostButton({ postId }: { postId: string }) {
  const [pending, setPending] = useState(false);

  async function handleDelete() {
    if (!confirm("정말 삭제하시겠습니까?")) return;
    setPending(true);
    await deletePost(postId);
  }

  return (
    <button
      onClick={handleDelete}
      disabled={pending}
      className="rounded-lg border border-red-500/30 text-red-500 px-4 py-2 text-sm font-medium hover:bg-red-500/10 transition-colors disabled:opacity-50"
    >
      {pending ? "삭제 중..." : "삭제"}
    </button>
  );
}
