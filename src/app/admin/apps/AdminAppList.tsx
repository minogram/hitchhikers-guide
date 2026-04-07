"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { Search, Sparkles, Eye, EyeOff, Pencil } from "lucide-react";
import { DeleteAppButton } from "./DeleteAppButton";
import { toggleAppVisibility } from "@/app/actions/apps";
import type { AdminApp } from "@/app/actions/apps";

export function AdminAppList({ apps: initialApps }: { apps: AdminApp[] }) {
  const [query, setQuery] = useState("");
  const [apps, setApps] = useState<AdminApp[]>(initialApps);
  const [togglingId, setTogglingId] = useState<string | null>(null);
  const [, startTransition] = useTransition();

  async function handleToggleVisibility(appId: string) {
    setTogglingId(appId);
    startTransition(async () => {
      const result = await toggleAppVisibility(appId);
      if (result.isVisible !== undefined) {
        setApps((prev) =>
          prev.map((a) => (a.id === appId ? { ...a, isVisible: result.isVisible! } : a))
        );
      }
      setTogglingId(null);
    });
  }

  const filtered = apps.filter((app) => {
    if (!query) return true;
    const q = query.toLowerCase();
    const industryTags: string[] = JSON.parse(app.industryTags);
    const processTags: string[] = JSON.parse(app.processTags);
    return (
      app.title.toLowerCase().includes(q) ||
      app.description.toLowerCase().includes(q) ||
      app.author.name.toLowerCase().includes(q) ||
      industryTags.some((t) => t.toLowerCase().includes(q)) ||
      processTags.some((t) => t.toLowerCase().includes(q))
    );
  });

  return (
    <>
      <div className="mb-4">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="앱 이름, 설명, 태그, 등록자로 검색..."
            className="w-full rounded-xl border border-border bg-card pl-11 pr-4 py-3 text-sm outline-none focus:border-accent transition-colors placeholder:text-muted"
          />
        </div>
        {query && (
          <p className="mt-2 text-xs text-muted">
            검색 결과: {filtered.length}건
          </p>
        )}
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
            {filtered.map((app) => {
              const industryTags: string[] = JSON.parse(app.industryTags);
              const processTags: string[] = JSON.parse(app.processTags);
              return (
                <tr key={app.id} className={`border-b border-border last:border-0 transition-opacity ${app.isVisible ? "" : "opacity-50"}`}>
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
                  <td className="px-6 py-4 text-muted whitespace-nowrap">
                    {new Date(app.createdAt).toLocaleDateString("en-CA")}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleToggleVisibility(app.id)}
                        disabled={togglingId === app.id}
                        title={app.isVisible ? "숨기기" : "노출하기"}
                        className={`p-1.5 rounded-lg transition-colors disabled:opacity-40 ${
                          app.isVisible
                            ? "text-green-600 hover:bg-green-500/10"
                            : "text-muted hover:bg-muted/10"
                        }`}
                      >
                        {app.isVisible ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                      </button>
                      <Link
                        href={`/admin/apps/${app.id}/edit`}
                        title="수정"
                        className="p-1.5 rounded-lg text-muted hover:text-accent hover:bg-accent/10 transition-colors"
                      >
                        <Pencil className="h-4 w-4" />
                      </Link>
                      <DeleteAppButton appId={app.id} appTitle={app.title} />
                    </div>
                  </td>
                </tr>
              );
            })}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-muted">
                  {query ? "검색 결과가 없습니다." : "등록된 앱이 없습니다."}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}
