"use client";

import { useState, useTransition } from "react";
import { updateUserRole } from "@/app/actions/admin";

export function UserRoleSelect({
  userId,
  currentRole,
}: {
  userId: string;
  currentRole: string;
}) {
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState("");

  function handleChange(newRole: string) {
    if (newRole === currentRole) return;

    startTransition(async () => {
      const result = await updateUserRole(userId, newRole);
      if (result.error) {
        setMessage(result.error);
      } else {
        setMessage("변경 완료");
        setTimeout(() => setMessage(""), 2000);
      }
    });
  }

  return (
    <div className="flex items-center gap-2">
      <select
        defaultValue={currentRole}
        onChange={(e) => handleChange(e.target.value)}
        disabled={isPending}
        className="rounded-lg border border-border bg-background px-3 py-1.5 text-xs outline-none focus:border-accent transition-colors disabled:opacity-50"
      >
        <option value="user">user</option>
        <option value="manager">manager</option>
      </select>
      {isPending && (
        <span className="text-xs text-muted animate-pulse">저장 중...</span>
      )}
      {message && (
        <span className="text-xs text-accent">{message}</span>
      )}
    </div>
  );
}
