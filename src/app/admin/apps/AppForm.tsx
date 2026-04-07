"use client";

import { useActionState, useState, useRef, useEffect, useTransition } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Sparkles, ImagePlus, Plus, ClipboardPaste } from "lucide-react";
import type { AppFormState } from "@/app/actions/apps";
import { addTagOption } from "@/app/actions/tags";

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
  redirectTo?: string;
  industryOptions: string[];
  processOptions: string[];
}

export function AppForm({ action, initialData, submitLabel, redirectTo, industryOptions: initialIndustryOptions, processOptions: initialProcessOptions }: AppFormProps) {
  const router = useRouter();
  const [state, formAction, pending] = useActionState(action, undefined);
  const [industryOptions, setIndustryOptions] = useState<string[]>(initialIndustryOptions);
  const [processOptions, setProcessOptions] = useState<string[]>(initialProcessOptions);
  const [selectedIndustryTags, setSelectedIndustryTags] = useState<Set<string>>(
    new Set(initialData?.industryTags ?? [])
  );
  const [selectedProcessTags, setSelectedProcessTags] = useState<Set<string>>(
    new Set(initialData?.processTags ?? [])
  );
  const [previewUrl, setPreviewUrl] = useState<string | null>(initialData?.thumbnail ?? null);
  const [thumbnailUrl, setThumbnailUrl] = useState<string>(initialData?.thumbnail ?? "");
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [pasteError, setPasteError] = useState<string | null>(null);
  const [geminiDemo, setGeminiDemo] = useState(initialData?.hasGeminiDemo ?? false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [newIndustryTag, setNewIndustryTag] = useState("");
  const [newProcessTag, setNewProcessTag] = useState("");
  const [addingTagError, setAddingTagError] = useState<string | null>(null);
  const [isAddingTag, startAddingTag] = useTransition();

  async function handleAddTag(type: "industry" | "process", label: string, setter: (v: string) => void, listSetter: (fn: (prev: string[]) => string[]) => void, selectSetter: (fn: (prev: Set<string>) => Set<string>) => void) {
    const trimmed = label.trim();
    if (!trimmed) return;
    setAddingTagError(null);
    startAddingTag(async () => {
      const result = await addTagOption(type, trimmed);
      if (result.error) {
        setAddingTagError(result.error);
      } else {
        listSetter((prev) => [...prev, trimmed]);
        selectSetter((prev) => new Set([...prev, trimmed]));
        setter("");
      }
    });
  }

  async function uploadFile(file: File) {
    setPreviewUrl(URL.createObjectURL(file));
    setUploading(true);
    setUploadError(null);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      const data = await res.json();
      if (data.url) {
        setThumbnailUrl(data.url);
      } else {
        setUploadError(data.error ?? "이미지 업로드에 실패했습니다.");
        setPreviewUrl(null);
      }
    } catch {
      setUploadError("이미지 업로드 중 오류가 발생했습니다.");
      setPreviewUrl(null);
    } finally {
      setUploading(false);
    }
  }

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    await uploadFile(file);
  }

  function handleDragOver(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault();
    setIsDragging(true);
  }

  function handleDragLeave(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault();
    setIsDragging(false);
  }

  async function handleDrop(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (!file || !file.type.startsWith("image/")) return;
    await uploadFile(file);
  }

  // 클립보드 blob(BMP 등 포함)을 canvas로 실제 PNG 파일로 변환
  function convertBlobToPng(blob: Blob): Promise<File> {
    return new Promise((resolve, reject) => {
      const blobUrl = URL.createObjectURL(blob);
      const img = new window.Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = img.naturalWidth;
        canvas.height = img.naturalHeight;
        canvas.getContext("2d")!.drawImage(img, 0, 0);
        URL.revokeObjectURL(blobUrl);
        canvas.toBlob((pngBlob) => {
          if (!pngBlob) return reject(new Error("변환 실패"));
          resolve(new File([pngBlob], "paste.png", { type: "image/png" }));
        }, "image/png");
      };
      img.onerror = () => { URL.revokeObjectURL(blobUrl); reject(new Error("이미지 로드 실패")); };
      img.src = blobUrl;
    });
  }

  async function handlePasteClick() {
    setPasteError(null);
    try {
      const items = await navigator.clipboard.read();
      for (const item of items) {
        const imageType = item.types.find((t) => t.startsWith("image/"));
        if (imageType) {
          const blob = await item.getType(imageType);
          const file = await convertBlobToPng(blob);
          await uploadFile(file);
          return;
        }
      }
      setPasteError("클립보드에 이미지가 없습니다.");
    } catch {
      setPasteError("클립보드 접근이 거부됐습니다. 브라우저 권한을 확인하세요.");
    }
  }

  useEffect(() => {
    if (state?.success && redirectTo) {
      router.push(redirectTo);
    }
  }, [state?.success, redirectTo, router]);

  if (state?.success && !redirectTo) {
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
          className={`relative flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed overflow-hidden transition-colors ${
            isDragging
              ? "border-accent bg-accent/10"
              : "border-border hover:border-accent"
          }`}
          style={{ aspectRatio: "4/3", maxHeight: 240 }}
          onClick={() => fileInputRef.current?.click()}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          {previewUrl ? (
            <Image src={previewUrl} alt="thumbnail preview" fill className="object-cover" unoptimized />
          ) : (
            <div className="flex flex-col items-center gap-2 text-muted">
              <ImagePlus className="h-8 w-8" />
              <span className="text-sm">
                {isDragging ? "여기에 놓으세요" : "클릭, 드래그 또는 Ctrl+V로 붙여넣기"}
              </span>
            </div>
          )}
          {isDragging && previewUrl && (
            <div className="absolute inset-0 flex items-center justify-center bg-accent/40">
              <span className="text-white text-sm font-medium">여기에 놓으세요</span>
            </div>
          )}
          {!isDragging && previewUrl && (
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
        {uploadError && <p className="mt-1 text-xs text-red-500">{uploadError}</p>}
        <div className="mt-2 flex items-center gap-3">
          <button
            type="button"
            onClick={handlePasteClick}
            className="flex items-center gap-1.5 rounded-lg border border-border bg-card px-3 py-1.5 text-xs text-muted hover:border-accent hover:text-accent transition-colors"
          >
            <ClipboardPaste className="h-3.5 w-3.5" />
            클립보드에서 붙여넣기
          </button>
          <span className="text-xs text-muted">PNG, JPG, WebP · 클릭 또는 드래그 앤 드롭</span>
        </div>
        {pasteError && <p className="mt-1 text-xs text-red-500">{pasteError}</p>}
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
                checked={selectedIndustryTags.has(tag)}
                onChange={(e) => setSelectedIndustryTags((prev) => {
                  const next = new Set(prev);
                  e.target.checked ? next.add(tag) : next.delete(tag);
                  return next;
                })}
                className="peer sr-only"
              />
              <span className="inline-block rounded-full px-4 py-1.5 text-sm font-medium border border-border peer-checked:bg-accent peer-checked:text-white peer-checked:border-accent transition-colors">
                {tag}
              </span>
            </label>
          ))}
        </div>
        <div className="mt-2 flex items-center gap-2">
          <input
            type="text"
            value={newIndustryTag}
            onChange={(e) => setNewIndustryTag(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleAddTag("industry", newIndustryTag, setNewIndustryTag, setIndustryOptions, setSelectedIndustryTags);
              }
            }}
            placeholder="새 카테고리 입력"
            className="rounded-lg border border-border bg-card px-3 py-1.5 text-sm outline-none focus:border-accent transition-colors w-40"
          />
          <button
            type="button"
            disabled={isAddingTag || !newIndustryTag.trim()}
            onClick={() => handleAddTag("industry", newIndustryTag, setNewIndustryTag, setIndustryOptions, setSelectedIndustryTags)}
            className="inline-flex items-center gap-1 rounded-full border border-border px-3 py-1.5 text-sm font-medium hover:border-accent hover:text-accent transition-colors disabled:opacity-40"
          >
            <Plus className="h-3.5 w-3.5" />
            추가
          </button>
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
                checked={selectedProcessTags.has(tag)}
                onChange={(e) => setSelectedProcessTags((prev) => {
                  const next = new Set(prev);
                  e.target.checked ? next.add(tag) : next.delete(tag);
                  return next;
                })}
                className="peer sr-only"
              />
              <span className="inline-block rounded-full px-4 py-1.5 text-sm font-medium border border-border peer-checked:bg-accent peer-checked:text-white peer-checked:border-accent transition-colors">
                {tag}
              </span>
            </label>
          ))}
        </div>
        <div className="mt-2 flex items-center gap-2">
          <input
            type="text"
            value={newProcessTag}
            onChange={(e) => setNewProcessTag(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleAddTag("process", newProcessTag, setNewProcessTag, setProcessOptions, setSelectedProcessTags);
              }
            }}
            placeholder="새 카테고리 입력"
            className="rounded-lg border border-border bg-card px-3 py-1.5 text-sm outline-none focus:border-accent transition-colors w-40"
          />
          <button
            type="button"
            disabled={isAddingTag || !newProcessTag.trim()}
            onClick={() => handleAddTag("process", newProcessTag, setNewProcessTag, setProcessOptions, setSelectedProcessTags)}
            className="inline-flex items-center gap-1 rounded-full border border-border px-3 py-1.5 text-sm font-medium hover:border-accent hover:text-accent transition-colors disabled:opacity-40"
          >
            <Plus className="h-3.5 w-3.5" />
            추가
          </button>
        </div>
        {addingTagError && (
          <p className="mt-1 text-xs text-red-500">{addingTagError}</p>
        )}
        {state?.errors?.processTags && (
          <p className="mt-1 text-xs text-red-500">{state.errors.processTags[0]}</p>
        )}
      </div>

      <div className="flex items-center justify-between rounded-xl border border-border bg-card px-5 py-4">
        <div className="flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-accent" />
          <span className="text-sm font-medium">Gemini AI 데모 활성화</span>
        </div>
        <button
          type="button"
          role="switch"
          aria-checked={geminiDemo}
          onClick={() => setGeminiDemo((v) => !v)}
          className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors focus:outline-none ${
            geminiDemo ? "bg-accent" : "bg-border"
          }`}
        >
          <span
            className={`pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow-sm transition-transform ${
              geminiDemo ? "translate-x-5" : "translate-x-0"
            }`}
          />
        </button>
        <input type="hidden" name="hasGeminiDemo" value={geminiDemo ? "on" : ""} />
      </div>

      <button
        type="submit"
        disabled={pending || uploading}
        className="w-full rounded-full bg-foreground py-3 text-sm font-semibold text-background hover:opacity-90 transition-opacity disabled:opacity-50"
      >
        {uploading ? "이미지 업로드 중..." : pending ? "저장 중..." : submitLabel}
      </button>
    </form>
  );
}
