"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import Image from "next/image";
import { Search, Sparkles, Eye, EyeOff, Pencil, ChevronLeft, ChevronRight, Heart } from "lucide-react";
import { DeleteAppButton } from "./DeleteAppButton";
import { toggleAppVisibility } from "@/app/actions/apps";
import type { AdminApp } from "@/app/actions/apps";

const PAGE_SIZE = 20;

export function AdminAppList({ apps: initialApps }: { apps: AdminApp[] }) {
  const [query, setQuery] = useState("");
  const [apps, setApps] = useState<AdminApp[]>(initialApps);
  const [togglingId, setTogglingId] = useState<string | null>(null);
  const [page, setPage] = useState(1);
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
    const tags: string[] = JSON.parse(app.tags);
    return (
      app.title.toLowerCase().includes(q) ||
      app.description.toLowerCase().includes(q) ||
      app.author.name.toLowerCase().includes(q) ||
      tags.some((t) => t.toLowerCase().includes(q))
    );
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const paginated = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  function handleQueryChange(value: string) {
    setQuery(value);
    setPage(1);
  }

  return (
    <>
      <div className="mb-4">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted" />
          <input
            type="text"
            value={query}
            onChange={(e) => handleQueryChange(e.target.value)}
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
              <th className="px-4 py-3 w-28"></th>
              <th className="text-left px-6 py-3 font-medium text-muted">앱 이름</th>
              <th className="text-left px-6 py-3 font-medium text-muted">태그</th>
              <th className="text-left px-6 py-3 font-medium text-muted">등록자</th>
              <th className="text-left px-6 py-3 font-medium text-muted">등록일</th>
              <th className="text-center px-6 py-3 font-medium text-muted whitespace-nowrap">좋아요</th>
              <th className="text-left px-6 py-3 font-medium text-muted">작업</th>
            </tr>
          </thead>
          <tbody>
            {paginated.map((app) => {
              const tags: string[] = JSON.parse(app.tags);
              return (
                <tr key={app.id} className={`border-b border-border last:border-0 transition-opacity ${app.isVisible ? "" : "opacity-50"}`}>
                  <td className="px-4 py-2">
                    {app.thumbnail ? (
                      <Image
                        src={app.thumbnail}
                        alt={app.title}
                        width={80}
                        height={40}
                        className="h-10 w-20 rounded-lg object-cover"
                      />
                    ) : (
                      <div className="h-10 w-20 rounded-lg bg-card-hover" />
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <Link
                        href={`/catalog/${app.id}`}
                        className="font-medium hover:text-accent transition-colors"
                      >
                        {app.title}
                      </Link>
                      {app.hasGeminiDemo && (
                        <Sparkles className="h-3.5 w-3.5 text-accent" />
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-1">
                      {tags.map((tag) => (
                        <span
                          key={tag}
                          className="inline-block rounded-full bg-accent/10 px-2 py-0.5 text-xs text-accent"
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
                  <td className="px-6 py-4 text-center">
                    <span className="inline-flex items-center gap-1 text-sm text-rose-500">
                      <Heart className="h-3.5 w-3.5" />
                      {app._count.likes}
                    </span>
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
            {paginated.length === 0 && (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-muted">
                  {query ? "검색 결과가 없습니다." : "등록된 앱이 없습니다."}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="mt-4 flex items-center justify-between text-sm text-muted">
          <span>
            {(currentPage - 1) * PAGE_SIZE + 1}–{Math.min(currentPage * PAGE_SIZE, filtered.length)} / {filtered.length}건
          </span>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-1.5 rounded-lg hover:bg-card-hover disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1)
              .filter((p) => p === 1 || p === totalPages || Math.abs(p - currentPage) <= 2)
              .reduce<(number | "...")[]>((acc, p, idx, arr) => {
                if (idx > 0 && p - (arr[idx - 1] as number) > 1) acc.push("...");
                acc.push(p);
                return acc;
              }, [])
              .map((item, idx) =>
                item === "..." ? (
                  <span key={`ellipsis-${idx}`} className="px-2">…</span>
                ) : (
                  <button
                    key={item}
                    onClick={() => setPage(item as number)}
                    className={`min-w-[2rem] h-8 rounded-lg px-2 transition-colors ${
                      currentPage === item
                        ? "bg-accent text-white font-medium"
                        : "hover:bg-card-hover"
                    }`}
                  >
                    {item}
                  </button>
                )
              )}
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="p-1.5 rounded-lg hover:bg-card-hover disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </>
  );
}
