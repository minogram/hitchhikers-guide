"use client";

import { useActionState } from "react";
import { Sparkles } from "lucide-react";
import type { AppFormState } from "@/app/actions/apps";

const industryOptions = ["Fashion", "Bags", "Shoes", "Beauty"];
const processOptions = ["Planning", "Design", "Production", "Commerce"];

interface AppFormProps {
  action: (prevState: AppFormState | undefined, formData: FormData) => Promise<AppFormState>;
  initialData?: {
    title: string;
    description: string;
    detailDescription: string | null;
    link: string;
    industryTags: string[];
    processTags: string[];
    hasGeminiDemo: boolean;
  };
  submitLabel: string;
}

export function AppForm({ action, initialData, submitLabel }: AppFormProps) {
  const [state, formAction, pending] = useActionState(action, undefined);

  if (state?.success) {
    return (
      <div className="rounded-2xl border border-accent/30 bg-accent/5 p-8 text-center">
        <p className="text-accent font-medium">{state.message}</p>
      </div>
    );
  }

  return (
    <form action={formAction} className="space-y-6">
      {state?.message && !state.success && (
        <div className="rounded-xl bg-red-500/10 p-4 text-sm text-red-500">
          {state.message}
        </div>
      )}

      <div>
        <label htmlFor="title" className="block text-sm font-medium mb-2">
          앱 이름 *
        </label>
        <input
          id="title"
          name="title"
          type="text"
          defaultValue={initialData?.title}
          className="w-full rounded-xl border border-border bg-card px-4 py-3 text-sm outline-none focus:border-accent transition-colors"
          required
        />
        {state?.errors?.title && (
          <p className="mt-1 text-xs text-red-500">{state.errors.title[0]}</p>
        )}
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium mb-2">
          한 줄 설명 *
        </label>
        <input
          id="description"
          name="description"
          type="text"
          defaultValue={initialData?.description}
          className="w-full rounded-xl border border-border bg-card px-4 py-3 text-sm outline-none focus:border-accent transition-colors"
          required
        />
        {state?.errors?.description && (
          <p className="mt-1 text-xs text-red-500">{state.errors.description[0]}</p>
        )}
      </div>

      <div>
        <label htmlFor="detailDescription" className="block text-sm font-medium mb-2">
          상세 설명
        </label>
        <textarea
          id="detailDescription"
          name="detailDescription"
          rows={4}
          defaultValue={initialData?.detailDescription ?? ""}
          className="w-full resize-none rounded-xl border border-border bg-card px-4 py-3 text-sm outline-none focus:border-accent transition-colors"
        />
      </div>

      <div>
        <label htmlFor="link" className="block text-sm font-medium mb-2">
          바로가기 URL *
        </label>
        <input
          id="link"
          name="link"
          type="url"
          defaultValue={initialData?.link}
          placeholder="https://"
          className="w-full rounded-xl border border-border bg-card px-4 py-3 text-sm outline-none focus:border-accent transition-colors"
          required
        />
        {state?.errors?.link && (
          <p className="mt-1 text-xs text-red-500">{state.errors.link[0]}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium mb-3">Industry 태그 *</label>
        <div className="flex flex-wrap gap-2">
          {industryOptions.map((tag) => (
            <label key={tag} className="cursor-pointer">
              <input
                type="checkbox"
                name="industryTagsChecked"
                value={tag}
                defaultChecked={initialData?.industryTags.includes(tag)}
                className="peer sr-only"
              />
              <span className="inline-block rounded-full px-4 py-1.5 text-sm font-medium border border-border peer-checked:bg-accent peer-checked:text-white peer-checked:border-accent transition-colors">
                {tag}
              </span>
            </label>
          ))}
        </div>
        {state?.errors?.industryTags && (
          <p className="mt-1 text-xs text-red-500">{state.errors.industryTags[0]}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium mb-3">Process 태그 *</label>
        <div className="flex flex-wrap gap-2">
          {processOptions.map((tag) => (
            <label key={tag} className="cursor-pointer">
              <input
                type="checkbox"
                name="processTagsChecked"
                value={tag}
                defaultChecked={initialData?.processTags.includes(tag)}
                className="peer sr-only"
              />
              <span className="inline-block rounded-full px-4 py-1.5 text-sm font-medium border border-border peer-checked:bg-accent peer-checked:text-white peer-checked:border-accent transition-colors">
                {tag}
              </span>
            </label>
          ))}
        </div>
        {state?.errors?.processTags && (
          <p className="mt-1 text-xs text-red-500">{state.errors.processTags[0]}</p>
        )}
      </div>

      <div className="flex items-center gap-3">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            name="hasGeminiDemo"
            defaultChecked={initialData?.hasGeminiDemo}
            className="rounded border-border"
          />
          <Sparkles className="h-4 w-4 text-accent" />
          <span className="text-sm font-medium">Gemini AI 데모 활성화</span>
        </label>
      </div>

      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-full bg-foreground py-3 text-sm font-semibold text-background hover:opacity-90 transition-opacity disabled:opacity-50"
      >
        {pending ? "저장 중..." : submitLabel}
      </button>
    </form>
  );
}
