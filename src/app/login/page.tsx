"use client";

import Link from "next/link";
import { useActionState } from "react";
import { Mail, Lock, ArrowRight } from "lucide-react";
import { login } from "@/app/actions/auth";

export default function LoginPage() {
  const [state, action, pending] = useActionState(login, undefined);

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-200px)]">
      <div className="w-full max-w-md px-6">
        <div className="text-center mb-8">
          <h1 className="font-serif text-3xl font-bold tracking-tight mb-2">
            로그인
          </h1>
          <p className="text-sm text-muted">
            계정에 로그인하여 모든 기능을 이용하세요.
          </p>
        </div>

        <form action={action} className="space-y-4">
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
                placeholder="you@example.com"
                className="w-full rounded-xl border border-border bg-card pl-11 pr-4 py-3 text-sm outline-none focus:border-accent transition-colors placeholder:text-muted"
              />
            </div>
            {state?.errors?.email && (
              <p className="mt-1 text-xs text-accent">{state.errors.email[0]}</p>
            )}
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium mb-2">
              비밀번호
            </label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted" />
              <input
                id="password"
                name="password"
                type="password"
                required
                placeholder="비밀번호를 입력하세요"
                className="w-full rounded-xl border border-border bg-card pl-11 pr-4 py-3 text-sm outline-none focus:border-accent transition-colors placeholder:text-muted"
              />
            </div>
            {state?.errors?.password && (
              <p className="mt-1 text-xs text-accent">{state.errors.password[0]}</p>
            )}
          </div>

          {state?.message && (
            <p className="text-sm text-accent text-center">{state.message}</p>
          )}

          <button
            type="submit"
            disabled={pending}
            className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-foreground px-6 py-3 text-sm font-semibold text-background hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {pending ? "로그인 중..." : "로그인"}
            <ArrowRight className="h-4 w-4" />
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-muted">
          계정이 없으신가요?{" "}
          <Link
            href="/register"
            className="font-medium text-accent hover:underline"
          >
            회원가입
          </Link>
        </p>
      </div>
    </div>
  );
}
