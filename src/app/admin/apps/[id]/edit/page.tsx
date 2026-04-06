import { requireRole } from "@/lib/auth-guard";
import { getAppById } from "@/app/actions/apps";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { EditAppForm } from "./EditAppForm";
import { getTagOptions } from "@/app/actions/tags";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EditAppPage({ params }: Props) {
  await requireRole("admin", "manager");
  const { id } = await params;
  const [app, { industry, process }] = await Promise.all([getAppById(id), getTagOptions()]);

  if (!app) notFound();

  const initialData = {
    title: app.title,
    description: app.description,
    detailDescription: app.detailDescription,
    link: app.link,
    industryTags: JSON.parse(app.industryTags) as string[],
    processTags: JSON.parse(app.processTags) as string[],
    hasGeminiDemo: app.hasGeminiDemo,
    thumbnail: app.thumbnail,
  };

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
          앱 수정
        </h1>
        <p className="mt-2 text-muted">
          &ldquo;{app.title}&rdquo; 정보를 수정합니다.
        </p>
      </div>

      <EditAppForm appId={id} initialData={initialData} industryOptions={industry} processOptions={process} />
    </div>
  );
}
