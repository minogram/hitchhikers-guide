"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

export function BackToCatalog() {
  const router = useRouter();

  return (
    <button
      type="button"
      onClick={() => router.back()}
      className="inline-flex items-center gap-2 text-sm text-muted hover:text-foreground transition-colors"
    >
      <ArrowLeft className="h-4 w-4" />
      카탈로그로 돌아가기
    </button>
  );
}
