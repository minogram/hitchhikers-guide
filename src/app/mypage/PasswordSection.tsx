"use client";

import { useActionState } from "react";
import { changePassword } from "@/app/actions/profile";
import { Lock, Check } from "lucide-react";

export function PasswordSection() {
  const [state, action, pending] = useActionState(changePassword, undefined);

  return (
    <section className="rounded-2xl border border-border bg-card p-6">
      <h2 className="text-lg font-bold mb-4">비밀번호 변경</h2>
      <form action={action} className="space-y-4">
        <div>
          <label
            htmlFor="currentPassword"
            className="block text-sm font-medium mb-2"
          >
            현재 비밀번호
          </label>
          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted" />
            <input
              id="currentPassword"
              name="currentPassword"
              type="password"
              required
              placeholder="현재 비밀번호"
              className="w-full rounded-xl border border-border bg-background pl-11 pr-4 py-3 text-sm outline-none focus:border-accent transition-colors placeholder:text-muted"
            />
          </div>
          {state?.errors?.currentPassword && (
            <p className="mt-1 text-xs text-accent">
              {state.errors.currentPassword[0]}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="newPassword"
            className="block text-sm font-medium mb-2"
          >
            새 비밀번호
          </label>
          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted" />
            <input
              id="newPassword"
              name="newPassword"
              type="password"
              required
              placeholder="8자 이상, 영문+숫자"
              className="w-full rounded-xl border border-border bg-background pl-11 pr-4 py-3 text-sm outline-none focus:border-accent transition-colors placeholder:text-muted"
            />
          </div>
          {state?.errors?.newPassword && (
            <ul className="mt-1 text-xs text-accent space-y-0.5">
              {state.errors.newPassword.map((err) => (
                <li key={err}>{err}</li>
              ))}
            </ul>
          )}
        </div>

        <div>
          <label
            htmlFor="confirmPassword"
            className="block text-sm font-medium mb-2"
          >
            새 비밀번호 확인
          </label>
          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted" />
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              required
              placeholder="비밀번호 확인"
              className="w-full rounded-xl border border-border bg-background pl-11 pr-4 py-3 text-sm outline-none focus:border-accent transition-colors placeholder:text-muted"
            />
          </div>
          {state?.errors?.confirmPassword && (
            <p className="mt-1 text-xs text-accent">
              {state.errors.confirmPassword[0]}
            </p>
          )}
        </div>

        {state?.success && (
          <p className="inline-flex items-center gap-1 text-sm text-green-600">
            <Check className="h-4 w-4" />
            {state.message}
          </p>
        )}
        {state?.message && !state.success && (
          <p className="text-sm text-accent">{state.message}</p>
        )}

        <button
          type="submit"
          disabled={pending}
          className="rounded-xl bg-foreground px-6 py-2.5 text-sm font-semibold text-background hover:opacity-90 transition-opacity disabled:opacity-50"
        >
          {pending ? "변경 중..." : "비밀번호 변경"}
        </button>
      </form>
    </section>
  );
}
