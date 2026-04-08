"use client";

import { useState, useEffect, useCallback, Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { Search, Filter, Sparkles } from "lucide-react";
import { LikeButton } from "@/components/LikeButton";

type CatalogApp = {
  id: string;
  title: string;
  thumbnail: string;
  description: string;
  tags: string[];
  industryTags: string[];
  processTags: string[];
  hasGeminiDemo: boolean;
  likeCount: number;
  isLiked: boolean;
};

export default function CatalogPage() {
  return (
    <Suspense>
      <CatalogContent />
    </Suspense>
  );
}

function CatalogContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [apps, setApps] = useState<CatalogApp[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState(searchParams.get("q") ?? "");
  const [selectedIndustry, setSelectedIndustry] = useState<Set<string>>(
    new Set(searchParams.get("industry")?.split(",").filter(Boolean) ?? [])
  );
  const [selectedProcess, setSelectedProcess] = useState<Set<string>>(
    new Set(searchParams.get("process")?.split(",").filter(Boolean) ?? [])
  );
  const [industryTags, setIndustryTags] = useState<string[]>([]);
  const [processTags, setProcessTags] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(() => {
    return !!(searchParams.get("industry") || searchParams.get("process"));
  });
  const [visibleCount, setVisibleCount] = useState(12);
  const PAGE_SIZE = 12;

  // Sync state → URL
  const syncUrl = useCallback(
    (q: string, industry: Set<string>, process: Set<string>) => {
      const params = new URLSearchParams();
      if (q) params.set("q", q);
      if (industry.size > 0) params.set("industry", [...industry].join(","));
      if (process.size > 0) params.set("process", [...process].join(","));
      const qs = params.toString();
      router.replace(qs ? `?${qs}` : "/catalog", { scroll: false });
    },
    [router]
  );

  useEffect(() => {
    fetch("/api/apps")
      .then((res) => res.json())
      .then((data) => {
        setApps(data);
        setLoading(false);
      });
    fetch("/api/tags")
      .then((res) => res.json())
      .then((data) => {
        setIndustryTags(data.industry ?? []);
        setProcessTags(data.process ?? []);
      });
  }, []);

  const hasActiveFilters = selectedIndustry.size > 0 || selectedProcess.size > 0;

  const filteredApps = apps.filter((app) => {
    const matchesSearch =
      !searchQuery ||
      app.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.description.toLowerCase().includes(searchQuery.toLowerCase());
    // Industry group: OR within group (any selected industry tag matches)
    const matchesIndustry =
      selectedIndustry.size === 0 ||
      app.tags.some((t) => selectedIndustry.has(t));
    // Process group: OR within group (any selected process tag matches)
    const matchesProcess =
      selectedProcess.size === 0 ||
      app.tags.some((t) => selectedProcess.has(t));
    // AND between groups
    return matchesSearch && matchesIndustry && matchesProcess;
  });

  // 검색/필터 변경 시 표시 개수 초기화
  useEffect(() => {
    setVisibleCount(PAGE_SIZE);
  }, [searchQuery, selectedIndustry, selectedProcess]);

  const visibleApps = filteredApps.slice(0, visibleCount);
  const hasMore = visibleCount < filteredApps.length;

  return (
    <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
      {/* Page Header */}
      <div className="mb-12">
        <p className="text-sm font-medium text-accent uppercase tracking-widest mb-2">
          Catalog
        </p>
        <h1 className="font-serif text-4xl font-bold tracking-tight sm:text-5xl">
          AI APPS
        </h1>
        <p className="mt-4 text-muted max-w-lg">
          패션 산업에 특화된 AI 도구를 산업별, 공정별로 탐색하세요.
        </p>
      </div>

      {/* Search & Filter Bar */}
      <div className="mb-8 space-y-4">
        <div className="flex gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted" />
            <input
              type="text"
              placeholder="앱 이름 또는 설명으로 검색..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                syncUrl(e.target.value, selectedIndustry, selectedProcess);
              }}
              className="w-full rounded-full border border-border bg-card pl-11 pr-4 py-3 text-sm outline-none focus:border-accent transition-colors placeholder:text-muted"
            />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`inline-flex items-center gap-2 rounded-full border px-5 py-3 text-sm font-medium transition-colors ${
              showFilters || hasActiveFilters
                ? "border-accent text-accent bg-accent/5"
                : "border-border hover:bg-card-hover"
            }`}
          >
            <Filter className="h-4 w-4" />
            필터
            {hasActiveFilters && (
              <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-accent text-xs text-white">
                {selectedIndustry.size + selectedProcess.size}
              </span>
            )}
          </button>
        </div>

        {/* Filter Tags */}
        {showFilters && (
          <div className="rounded-2xl border border-border bg-card p-6 space-y-4">
            <div>
              <p className="text-xs text-muted mb-2 uppercase tracking-wider font-medium">Industry</p>
              <div className="flex flex-wrap gap-2">
                {industryTags.map((tag) => (
                  <button
                    key={tag}
                    onClick={() =>
                      setSelectedIndustry((prev) => {
                        const next = new Set(prev);
                        next.has(tag) ? next.delete(tag) : next.add(tag);
                        syncUrl(searchQuery, next, selectedProcess);
                        return next;
                      })
                    }
                    className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
                      selectedIndustry.has(tag)
                        ? "bg-accent text-white"
                        : "bg-foreground/5 text-muted hover:text-foreground"
                    }`}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <p className="text-xs text-muted mb-2 uppercase tracking-wider font-medium">Process</p>
              <div className="flex flex-wrap gap-2">
                {processTags.map((tag) => (
                  <button
                    key={tag}
                    onClick={() =>
                      setSelectedProcess((prev) => {
                        const next = new Set(prev);
                        next.has(tag) ? next.delete(tag) : next.add(tag);
                        syncUrl(searchQuery, selectedIndustry, next);
                        return next;
                      })
                    }
                    className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
                      selectedProcess.has(tag)
                        ? "bg-accent text-white"
                        : "bg-foreground/5 text-muted hover:text-foreground"
                    }`}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
            {hasActiveFilters && (
              <button
                onClick={() => {
                  setSelectedIndustry(new Set());
                  setSelectedProcess(new Set());
                  syncUrl(searchQuery, new Set(), new Set());
                }}
                className="text-xs text-muted hover:text-foreground transition-colors"
              >
                필터 초기화
              </button>
            )}
          </div>
        )}
      </div>

      {/* Results Count */}
      <p className="mb-6 text-sm text-muted">
        {loading ? "로딩 중..." : `전체 ${filteredApps.length}개 중 ${visibleApps.length}개 표시`}
      </p>

      {/* App Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {visibleApps.map((app) => (
          <Link
            key={app.id}
            href={`/catalog/${app.id}`}
            className="group rounded-2xl border border-border bg-card p-6 hover:bg-card-hover transition-colors"
          >
            <div className="aspect-[4/3] rounded-xl bg-background overflow-hidden mb-4 relative">
              <Image
                src={app.thumbnail}
                alt={app.title}
                width={400}
                height={300}
                className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              {app.hasGeminiDemo && (
                <div className="absolute top-3 right-3 inline-flex items-center gap-1 rounded-full bg-accent px-3 py-1 text-xs font-medium text-white">
                  <Sparkles className="h-3 w-3" />
                  Gemini
                </div>
              )}
            </div>
            <div className="flex items-start justify-between gap-2 mb-1">
              <h3 className="text-lg font-bold group-hover:text-accent transition-colors leading-snug">
                {app.title}
              </h3>
              <LikeButton
                appId={app.id}
                initialLiked={app.isLiked}
                initialCount={app.likeCount}
                size="sm"
              />
            </div>
            <p className="text-sm text-muted leading-relaxed line-clamp-2 mb-3">
              {app.description}
            </p>
            <div className="space-y-1.5">
              {app.industryTags.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {app.industryTags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-block rounded-full bg-accent/10 px-3 py-1 text-xs font-medium text-accent"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
              {app.processTags.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {app.processTags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-block rounded-full bg-foreground/5 px-3 py-1 text-xs font-medium text-muted"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </Link>
        ))}
      </div>

      {filteredApps.length === 0 && !loading && (
        <div className="text-center py-20">
          <p className="text-muted">검색 결과가 없습니다.</p>
        </div>
      )}

      {hasMore && (
        <div className="mt-10 flex justify-center">
          <button
            onClick={() => setVisibleCount((c) => c + PAGE_SIZE)}
            className="rounded-full border border-border bg-card px-8 py-3 text-sm font-medium hover:border-accent hover:text-accent transition-colors"
          >
            더보기 ({filteredApps.length - visibleCount}개 남음)
          </button>
        </div>
      )}
    </div>
  );
}
