"use client";

import { useActionState, useState, useRef } from "react";
import Image from "next/image";
import { Sparkles, ImagePlus } from "lucide-react";
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
    thumbnail?: string;
  };
  submitLabel: string;
}

export function AppForm({ action, initialData, submitLabel }: AppFormProps) {
  const [state, formAction, pending] = useActionState(action, undefined);
  const [previewUrl, setPreviewUrl] = useState<string | null>(initialData?.thumbnail ?? null);
  const [thumbnailUrl, setThumbnailUrl] = useState<string>(initialData?.thumbnail ?? "");
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setPreviewUrl(URL.createObjectURL(file));
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      const data = await res.json();
      if (data.url) setThumbnailUrl(data.url);
    } finally {
      setUploading(false);
    }
  }

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

      {/* Thumbnail */}
      <div>
        <label className="block text-sm font-medium mb-2">썸네일 이미지</label>
        <div
          className="relative flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-border hover:border-accent transition-colors overflow-hidden"
          style={{ aspectRatio: "4/3", maxHeight: 240 }}
          onClick={() => fileInputRef.current?.click()}
        >
          {previewUrl ? (
            <Image src={previewUrl} alt="thumbnail preview" fill className="object-cover" unoptimized />
          ) : (
            <div className="flex flex-col items-center gap-2 text-muted">
              <ImagePlus className="h-8 w-8" />
              <span className="text-sm">클릭하여 이미지 선택</span>
            </div>
          )}
          {previewUrl && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 hover:opacity-100 transition-opacity">
              <span className="text-white text-sm font-medium">{uploading ? "업로드 중..." : "이미지 변경"}</span>
            </div>
          )}
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="sr-only"
          onChange={handleFileChange}
        />
        <input type="hidden" name="thumbnail" value={thumbnailUrl} />
        <p className="mt-1 text-xs text-muted">PNG, JPG, WebP (권장 4:3 비율)</p>
      </div>

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
