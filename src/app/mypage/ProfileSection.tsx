"use client";

import { useActionState } from "react";
import { updateProfile } from "@/app/actions/profile";
import { Mail, User, Check } from "lucide-react";

export function ProfileSection({
  initialName,
  initialEmail,
}: {
  initialName: string;
  initialEmail: string;
}) {
  const [state, action, pending] = useActionState(updateProfile, undefined);

  return (
    <section className="rounded-2xl border border-border bg-card p-6">
      <h2 className="text-lg font-bold mb-4">프로필 정보</h2>
      <form action={action} className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium mb-2">
            이름
          </label>
          <div className="relative">
            <User className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted" />
            <input
              id="name"
              name="name"
              type="text"
              required
              defaultValue={initialName}
              className="w-full rounded-xl border border-border bg-background pl-11 pr-4 py-3 text-sm outline-none focus:border-accent transition-colors"
            />
          </div>
          {state?.errors?.name && (
            <p className="mt-1 text-xs text-accent">{state.errors.name[0]}</p>
          )}
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium mb-2">
            이메일
          </label>
          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted" />
            <input
              id="email"
              name="email"
              type="email"
              required
              defaultValue={initialEmail}
              className="w-full rounded-xl border border-border bg-background pl-11 pr-4 py-3 text-sm outline-none focus:border-accent transition-colors"
            />
          </div>
          {state?.errors?.email && (
            <p className="mt-1 text-xs text-accent">{state.errors.email[0]}</p>
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
          {pending ? "저장 중..." : "프로필 저장"}
        </button>
      </form>
    </section>
  );
}
