"use client";

import { useTransition } from "react";
import { deleteApp } from "@/app/actions/apps";

export function DeleteAppButton({
  appId,
  appTitle,
}: {
  appId: string;
  appTitle: string;
}) {
  const [isPending, startTransition] = useTransition();

  function handleDelete() {
    if (!confirm(`"${appTitle}" 앱을 삭제하시겠습니까?`)) return;

    startTransition(async () => {
      await deleteApp(appId);
    });
  }

  return (
    <button
      onClick={handleDelete}
      disabled={isPending}
      className="text-xs text-red-500 hover:underline disabled:opacity-50"
    >
      {isPending ? "삭제 중..." : "삭제"}
    </button>
  );
}
