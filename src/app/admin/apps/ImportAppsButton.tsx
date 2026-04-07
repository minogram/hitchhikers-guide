"use client";

import { useState, useTransition, useRef } from "react";
import { Upload, CheckCircle, AlertCircle, X } from "lucide-react";
import { importAppsFromJson } from "@/app/actions/apps";
import type { ImportResult } from "@/app/actions/apps";

export function ImportAppsButton() {
  const [isPending, startTransition] = useTransition();
  const [result, setResult] = useState<ImportResult | null>(null);
  const [showDetail, setShowDetail] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    // 같은 파일 재선택 가능하도록 초기화
    e.target.value = "";

    setResult(null);
    setShowDetail(false);

    const reader = new FileReader();
    reader.onload = (ev) => {
      const text = ev.target?.result as string;
      startTransition(async () => {
        const res = await importAppsFromJson(text);
        setResult(res);
      });
    };
    reader.readAsText(file, "utf-8");
  }

  return (
    <div className="relative">
      <input
        ref={fileInputRef}
        type="file"
        accept=".json,application/json"
        className="sr-only"
        onChange={handleFileChange}
      />
      <button
        onClick={() => fileInputRef.current?.click()}
        disabled={isPending}
        className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-5 py-2.5 text-sm font-semibold hover:border-accent hover:text-accent transition-colors disabled:opacity-50"
      >
        <Upload className="h-4 w-4" />
        {isPending ? "가져오는 중..." : "JSON에서 일괄 등록"}
      </button>

      {result && (
        <div
          className={`absolute right-0 top-full mt-2 z-50 w-80 rounded-2xl border p-4 shadow-lg text-sm ${
            result.error
              ? "border-red-500/30 bg-red-500/5"
              : "border-green-500/30 bg-green-500/5"
          }`}
        >
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-center gap-2">
              {result.error ? (
                <AlertCircle className="h-4 w-4 shrink-0 text-red-500" />
              ) : (
                <CheckCircle className="h-4 w-4 shrink-0 text-green-600" />
              )}
              <div>
                {result.error ? (
                  <p className="text-red-500">{result.error}</p>
                ) : (
                  <>
                    <p className="font-medium text-foreground">
                      {result.created}개 등록 완료
                      {result.skipped ? `, ${result.skipped}개 건너뜀` : ""}
                    </p>
                    {result.skipped && result.skipped > 0 && (
                      <button
                        onClick={() => setShowDetail((v) => !v)}
                        className="mt-1 text-xs text-muted hover:text-foreground underline"
                      >
                        {showDetail ? "닫기" : "건너뜀 목록 보기"}
                      </button>
                    )}
                    {showDetail && result.skippedTitles && (
                      <ul className="mt-2 space-y-0.5 text-xs text-muted max-h-40 overflow-y-auto">
                        {result.skippedTitles.map((t) => (
                          <li key={t} className="truncate">· {t}</li>
                        ))}
                      </ul>
                    )}
                  </>
                )}
              </div>
            </div>
            <button
              onClick={() => setResult(null)}
              className="shrink-0 text-muted hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
