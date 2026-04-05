import { requireRole } from "@/lib/auth-guard";
import { getApps } from "@/app/actions/apps";
import Link from "next/link";
import { ArrowLeft, AppWindow, Plus, Sparkles } from "lucide-react";
import { DeleteAppButton } from "./DeleteAppButton";

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

      <div className="rounded-2xl border border-border bg-card overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-card-hover">
              <th className="text-left px-6 py-3 font-medium text-muted">앱 이름</th>
              <th className="text-left px-6 py-3 font-medium text-muted">태그</th>
              <th className="text-left px-6 py-3 font-medium text-muted">등록자</th>
              <th className="text-left px-6 py-3 font-medium text-muted">등록일</th>
              <th className="text-left px-6 py-3 font-medium text-muted">작업</th>
            </tr>
          </thead>
          <tbody>
            {apps.map((app) => {
              const industryTags: string[] = JSON.parse(app.industryTags);
              const processTags: string[] = JSON.parse(app.processTags);
              return (
                <tr key={app.id} className="border-b border-border last:border-0">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{app.title}</span>
                      {app.hasGeminiDemo && (
                        <Sparkles className="h-3.5 w-3.5 text-accent" />
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-1">
                      {industryTags.map((tag) => (
                        <span
                          key={tag}
                          className="inline-block rounded-full bg-accent/10 px-2 py-0.5 text-xs text-accent"
                        >
                          {tag}
                        </span>
                      ))}
                      {processTags.map((tag) => (
                        <span
                          key={tag}
                          className="inline-block rounded-full bg-foreground/5 px-2 py-0.5 text-xs text-muted"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-muted">{app.author.name}</td>
                  <td className="px-6 py-4 text-muted">
                    {new Date(app.createdAt).toLocaleDateString("ko-KR")}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <Link
                        href={`/admin/apps/${app.id}/edit`}
                        className="text-xs text-accent hover:underline"
                      >
                        수정
                      </Link>
                      <DeleteAppButton appId={app.id} appTitle={app.title} />
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
