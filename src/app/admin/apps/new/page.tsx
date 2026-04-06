import { requireRole } from "@/lib/auth-guard";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { AppForm } from "../AppForm";
import { createApp } from "@/app/actions/apps";
import { getTagOptions } from "@/app/actions/tags";

export default async function NewAppPage() {
  await requireRole("admin", "manager");
  const { industry, process } = await getTagOptions();

  return (
    <div className="mx-auto max-w-2xl px-6 py-12 lg:px-8">
      <Link
        href="/admin/apps"
        className="inline-flex items-center gap-2 text-sm text-muted hover:text-foreground transition-colors mb-8"
      >
        <ArrowLeft className="h-4 w-4" />
        앱 목록으로 돌아가기
      </Link>

      <div className="mb-8">
        <h1 className="font-serif text-3xl font-bold tracking-tight">
          새 앱 등록
        </h1>
        <p className="mt-2 text-muted">
          AI 앱 카탈로그에 새로운 앱을 등록합니다.
        </p>
      </div>

      <AppForm
        action={createApp}
        submitLabel="앱 등록"
        industryOptions={industry}
        processOptions={process}
      />
    </div>
  );
}
