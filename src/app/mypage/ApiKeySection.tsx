"use client";

import { useActionState } from "react";
import { saveApiKey } from "@/app/actions/profile";
import { Key, Check, ShieldCheck, AlertTriangle } from "lucide-react";

export function ApiKeySection({ hasApiKey }: { hasApiKey: boolean }) {
  const [state, action, pending] = useActionState(saveApiKey, undefined);

  return (
    <section className="rounded-2xl border border-border bg-card p-6">
      <h2 className="text-lg font-bold mb-2">Gemini API 키</h2>
      <p className="text-sm text-muted mb-4">
        개인 Gemini API 키를 등록하면 AI 기능을 사용할 수 있습니다.
      </p>

      <div className="rounded-xl bg-accent-light/50 border border-accent/20 p-4 mb-4">
        <div className="flex items-start gap-2">
          <ShieldCheck className="h-4 w-4 text-accent mt-0.5 shrink-0" />
          <div className="text-xs text-muted space-y-1">
            <p>API 키는 AES-256-GCM으로 암호화되어 저장됩니다.</p>
            <p>키는 서버 측에서만 사용되며, 브라우저에 노출되지 않습니다.</p>
          </div>
        </div>
      </div>

      {hasApiKey && !state?.success && (
        <div className="flex items-center gap-2 mb-4 text-sm text-green-600">
          <Check className="h-4 w-4" />
          API 키가 등록되어 있습니다.
        </div>
      )}

      <form action={action} className="space-y-4">
        <div>
          <label htmlFor="apiKey" className="block text-sm font-medium mb-2">
            {hasApiKey ? "API 키 변경" : "API 키 등록"}
          </label>
          <div className="relative">
            <Key className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted" />
            <input
              id="apiKey"
              name="apiKey"
              type="password"
              placeholder={
                hasApiKey
                  ? "새 키를 입력하거나 비워두면 삭제됩니다"
                  : "AIza..."
              }
              className="w-full rounded-xl border border-border bg-background pl-11 pr-4 py-3 text-sm outline-none focus:border-accent transition-colors placeholder:text-muted"
            />
          </div>
          {state?.errors?.apiKey && (
            <p className="mt-1 text-xs text-accent">
              {state.errors.apiKey[0]}
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

        <div className="flex gap-3">
          <button
            type="submit"
            disabled={pending}
            className="rounded-xl bg-foreground px-6 py-2.5 text-sm font-semibold text-background hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {pending ? "저장 중..." : "저장"}
          </button>
        </div>
      </form>

      <div className="mt-4 flex items-start gap-2 text-xs text-muted">
        <AlertTriangle className="h-3.5 w-3.5 mt-0.5 shrink-0" />
        <p>
          Google AI Studio에서 API 키를 발급받을 수 있습니다:{" "}
          <a
            href="https://aistudio.google.com/apikey"
            target="_blank"
            rel="noopener noreferrer"
            className="text-accent hover:underline"
          >
            aistudio.google.com/apikey
          </a>
        </p>
      </div>
    </section>
  );
}
