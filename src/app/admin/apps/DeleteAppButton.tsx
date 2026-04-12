"use client";

import { useState, useTransition } from "react";
import { Trash2 } from "lucide-react";
import { deleteApp } from "@/app/actions/apps";
import { ConfirmDialog } from "@/components/ConfirmDialog";

export function DeleteAppButton({
  appId,
  appTitle,
}: {
  appId: string;
  appTitle: string;
}) {
  const [isPending, startTransition] = useTransition();
  const [showConfirm, setShowConfirm] = useState(false);

  function handleDelete() {
    startTransition(async () => {
      await deleteApp(appId);
    });
  }

  return (
    <>
      <button
        onClick={() => setShowConfirm(true)}
        disabled={isPending}
        title="삭제"
        className="p-1.5 rounded-lg text-red-500 hover:bg-red-500/10 transition-colors disabled:opacity-50"
      >
        <Trash2 className="h-4 w-4" />
      </button>
      <ConfirmDialog
        open={showConfirm}
        title="앱 삭제"
        description={`"${appTitle}" 앱을 삭제하시겠습니까?`}
        confirmLabel="삭제"
        onConfirm={() => { setShowConfirm(false); handleDelete(); }}
        onCancel={() => setShowConfirm(false)}
      />
    </>
  );
}
