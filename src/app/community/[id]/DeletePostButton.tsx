"use client";

import { useState } from "react";
import { deletePost } from "@/app/actions/posts";
import { ConfirmDialog } from "@/components/ConfirmDialog";

export function DeletePostButton({ postId }: { postId: string }) {
  const [pending, setPending] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  async function handleDelete() {
    setPending(true);
    await deletePost(postId);
  }

  return (
    <>
      <button
        onClick={() => setShowConfirm(true)}
        disabled={pending}
        className="rounded-lg border border-red-500/30 text-red-500 px-4 py-2 text-sm font-medium hover:bg-red-500/10 transition-colors disabled:opacity-50"
      >
        {pending ? "삭제 중..." : "삭제"}
      </button>
      <ConfirmDialog
        open={showConfirm}
        title="게시글 삭제"
        description="정말 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다."
        confirmLabel="삭제"
        onConfirm={() => { setShowConfirm(false); handleDelete(); }}
        onCancel={() => setShowConfirm(false)}
      />
    </>
  );
}
