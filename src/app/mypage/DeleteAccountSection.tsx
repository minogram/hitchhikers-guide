"use client";

import { useState, useActionState } from "react";
import { signOut } from "next-auth/react";
import { deleteAccount } from "@/app/actions/profile";
import { Trash2, AlertTriangle, Lock } from "lucide-react";

export function DeleteAccountSection() {
  const [open, setOpen] = useState(false);
  const [state, action, pending] = useActionState(deleteAccount, undefined);

  // If deletion succeeded, sign out
  if (state?.success) {
    signOut({ callbackUrl: "/" });
    return (
      <section className="rounded-2xl border border-red-500/30 bg-card p-6">
        <p className="text-sm text-muted">계정이 삭제되었습니다. 로그아웃 중...</p>
      </section>
    );
  }

  return (
    <section className="rounded-2xl border border-red-500/30 bg-card p-6">
      <div className="flex items-center gap-2 mb-2">
        <AlertTriangle className="h-5 w-5 text-red-500" />
        <h2 className="text-lg font-bold text-red-500">계정 탈퇴</h2>
      </div>
      <p className="text-sm text-muted mb-4">
        탈퇴 시 작성한 게시글과 댓글이 모두 삭제되며, 복구할 수 없습니다.
      </p>

      {!open ? (
        <button
          onClick={() => setOpen(true)}
          className="inline-flex items-center gap-2 rounded-xl border border-red-500/30 text-red-500 px-4 py-2.5 text-sm font-medium hover:bg-red-500/10 transition-colors"
        >
          <Trash2 className="h-4 w-4" />
          계정 탈퇴
        </button>
      ) : (
        <form action={action} className="space-y-4">
          <div>
            <label htmlFor="delete-password" className="block text-sm font-medium mb-2">
              비밀번호 확인
            </label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted" />
              <input
                id="delete-password"
                name="password"
                type="password"
                required
                placeholder="현재 비밀번호를 입력하세요"
                className="w-full rounded-xl border border-red-500/30 bg-background pl-11 pr-4 py-3 text-sm outline-none focus:border-red-500 transition-colors placeholder:text-muted"
              />
            </div>
            {state?.errors?.password && (
              <p className="mt-1 text-xs text-red-500">{state.errors.password[0]}</p>
            )}
          </div>

          {state?.message && !state.success && (
            <p className="text-sm text-red-500">{state.message}</p>
          )}

          <div className="flex gap-3">
            <button
              type="submit"
              disabled={pending}
              className="rounded-xl bg-red-500 px-6 py-2.5 text-sm font-semibold text-white hover:bg-red-600 transition-colors disabled:opacity-50"
            >
              {pending ? "처리 중..." : "탈퇴 확인"}
            </button>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="rounded-xl border border-border px-6 py-2.5 text-sm font-medium hover:bg-card-hover transition-colors"
            >
              취소
            </button>
          </div>
        </form>
      )}
    </section>
  );
}
