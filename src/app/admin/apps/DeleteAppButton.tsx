"use client";

import { useTransition } from "react";
import { Trash2 } from "lucide-react";
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
      title="삭제"
      className="p-1.5 rounded-lg text-red-500 hover:bg-red-500/10 transition-colors disabled:opacity-50"
    >
      <Trash2 className="h-4 w-4" />
    </button>
  );
}
