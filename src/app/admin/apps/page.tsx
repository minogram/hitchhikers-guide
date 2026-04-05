import { requireRole } from "@/lib/auth-guard";
import { getApps } from "@/app/actions/apps";
import Link from "next/link";
import { ArrowLeft, AppWindow, Plus } from "lucide-react";
import { AdminAppList } from "./AdminAppList";

export default async function AdminAppsPage() {
  await requireRole("admin", "manager");
  const apps = await getApps();

  return (
    <div className="mx-auto max-w-6xl px-6 py-12 lg:px-8">
      <Link
        href="/admin"
        className="inline-flex items-center gap-2 text-sm text-muted hover:text-foreground transition-colors mb-8"
      >
        <ArrowLeft className="h-4 w-4" />
        대시보드로 돌아가기
      </Link>

      <div className="flex items-center justify-between mb-8">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <AppWindow className="h-6 w-6 text-accent" />
            <h1 className="font-serif text-3xl font-bold tracking-tight">
              앱 카탈로그 관리
            </h1>
          </div>
          <p className="text-muted">총 {apps.length}개의 앱</p>
        </div>
        <Link
          href="/admin/apps/new"
          className="inline-flex items-center gap-2 rounded-full bg-accent px-5 py-2.5 text-sm font-semibold text-white hover:opacity-90 transition-opacity"
        >
          <Plus className="h-4 w-4" />
          새 앱 등록
        </Link>
      </div>

      <AdminAppList apps={apps} />
    </div>
  );
}
