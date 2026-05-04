"use client";

import { useState, useEffect, useCallback, Suspense, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { Search, Filter, Sparkles, X } from "lucide-react";
import { LikeButton } from "@/components/LikeButton";
import { matchesCatalogSearch } from "@/lib/catalog-search";

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

const FILTER_SUMMARY_LIMIT = 4;

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
  const [isFilterDialogOpen, setIsFilterDialogOpen] = useState(false);
  const [visibleCount, setVisibleCount] = useState(12);
  const PAGE_SIZE = 12;

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
  const activeFilters = [
    ...[...selectedIndustry].map((tag) => ({ key: `industry-${tag}`, label: tag, type: "industry" as const })),
    ...[...selectedProcess].map((tag) => ({ key: `process-${tag}`, label: tag, type: "process" as const })),
  ];
  const visibleFilterSummary = activeFilters.slice(0, FILTER_SUMMARY_LIMIT);
  const hiddenFilterCount = activeFilters.length - visibleFilterSummary.length;

  const filteredApps = apps.filter((app) => {
    const matchesSearch = matchesCatalogSearch(app, searchQuery);
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

  useEffect(() => {
    const params = new URLSearchParams();
    if (searchQuery) params.set("q", searchQuery);
    if (selectedIndustry.size > 0) {
      params.set("industry", [...selectedIndustry].join(","));
    }
    if (selectedProcess.size > 0) {
      params.set("process", [...selectedProcess].join(","));
    }

    const nextQuery = params.toString();
    const currentQuery = searchParams.toString();

    if (nextQuery === currentQuery) return;

    router.replace(nextQuery ? `?${nextQuery}` : "/catalog", { scroll: false });
  }, [router, searchParams, searchQuery, selectedIndustry, selectedProcess]);

  const visibleApps = filteredApps.slice(0, visibleCount);
  const hasMore = visibleCount < filteredApps.length;

  const toggleIndustryTag = useCallback(
    (tag: string) => {
      setSelectedIndustry((prev) => {
        const next = new Set(prev);
        next.has(tag) ? next.delete(tag) : next.add(tag);
        return next;
      });
    },
    []
  );

  const toggleProcessTag = useCallback(
    (tag: string) => {
      setSelectedProcess((prev) => {
        const next = new Set(prev);
        next.has(tag) ? next.delete(tag) : next.add(tag);
        return next;
      });
    },
    []
  );

  const clearFilters = useCallback(() => {
    setSelectedIndustry(new Set());
    setSelectedProcess(new Set());
  }, []);

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
              onChange={(e) => setSearchQuery(e.target.value)}
              aria-label="앱 검색"
              className="w-full rounded-full border border-border bg-card pl-11 pr-4 py-3 text-sm outline-none focus:border-accent transition-colors placeholder:text-muted"
            />
          </div>
          <button
            onClick={() => setIsFilterDialogOpen(true)}
            className={`inline-flex items-center gap-2 rounded-full border px-5 py-3 text-sm font-medium transition-colors ${
              isFilterDialogOpen || hasActiveFilters
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

        {hasActiveFilters && (
          <div className="flex flex-wrap items-center gap-2">
            {visibleFilterSummary.map((filter) => (
              <button
                key={filter.key}
                onClick={() =>
                  filter.type === "industry"
                    ? toggleIndustryTag(filter.label)
                    : toggleProcessTag(filter.label)
                }
                className="inline-flex items-center gap-1 rounded-full border border-border bg-card px-3 py-1.5 text-sm text-foreground hover:border-accent hover:text-accent"
              >
                <span>{filter.label}</span>
                <X className="h-3.5 w-3.5" />
              </button>
            ))}
            {hiddenFilterCount > 0 && (
              <span className="rounded-full bg-foreground/5 px-3 py-1.5 text-sm text-muted">
                외 {hiddenFilterCount}개
              </span>
            )}
            <button
              onClick={clearFilters}
              className="text-sm text-muted hover:text-foreground transition-colors"
            >
              모두 지우기
            </button>
          </div>
        )}
      </div>

      <FilterDialog
        open={isFilterDialogOpen}
        industryTags={industryTags}
        processTags={processTags}
        selectedIndustry={selectedIndustry}
        selectedProcess={selectedProcess}
        hasActiveFilters={hasActiveFilters}
        onClose={() => setIsFilterDialogOpen(false)}
        onToggleIndustry={toggleIndustryTag}
        onToggleProcess={toggleProcessTag}
        onClearFilters={clearFilters}
      />

      {/* Results Count */}
      <p className="mb-6 text-sm text-muted">
        {loading ? "로딩 중..." : `전체 ${filteredApps.length}개 중 ${visibleApps.length}개 표시`}
      </p>

      {/* App Grid */}
      {loading ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="rounded-2xl border border-border bg-card p-6 animate-pulse">
              <div className="aspect-[4/3] rounded-xl bg-muted/20 mb-4" />
              <div className="h-5 w-3/4 rounded bg-muted/20 mb-2" />
              <div className="h-4 w-full rounded bg-muted/20 mb-1" />
              <div className="h-4 w-2/3 rounded bg-muted/20 mb-3" />
              <div className="flex gap-2">
                <div className="h-6 w-16 rounded-full bg-muted/20" />
                <div className="h-6 w-16 rounded-full bg-muted/20" />
              </div>
            </div>
          ))}
        </div>
      ) : (
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {visibleApps.map((app, index) => (
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
                priority={index === 0}
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
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
                  {[...new Set(app.industryTags)].map((tag) => (
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
                  {[...new Set(app.processTags)].map((tag) => (
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
      )}

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

type FilterDialogProps = {
  open: boolean;
  industryTags: string[];
  processTags: string[];
  selectedIndustry: Set<string>;
  selectedProcess: Set<string>;
  hasActiveFilters: boolean;
  onClose: () => void;
  onToggleIndustry: (tag: string) => void;
  onToggleProcess: (tag: string) => void;
  onClearFilters: () => void;
};

function FilterDialog({
  open,
  industryTags,
  processTags,
  selectedIndustry,
  selectedProcess,
  hasActiveFilters,
  onClose,
  onToggleIndustry,
  onToggleProcess,
  onClearFilters,
}: FilterDialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (open && !dialog.open) {
      dialog.showModal();
      return;
    }

    if (!open && dialog.open) {
      dialog.close();
    }
  }, [open]);

  if (!open) return null;

  return (
    <dialog
      ref={dialogRef}
      onClose={onClose}
      onCancel={onClose}
      onClick={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
      className="fixed inset-0 z-50 m-auto w-[min(720px,calc(100%-2rem))] rounded-[2rem] border border-border bg-background p-0 shadow-2xl backdrop:bg-black/50"
    >
      <div className="flex max-h-[min(80vh,720px)] flex-col p-6 sm:p-8">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="mb-2 text-xs font-medium uppercase tracking-[0.3em] text-accent">
              Filter
            </p>
            <h2 className="font-serif text-2xl font-bold">검색 필터</h2>
            <p className="mt-2 text-sm text-muted">
              필요한 태그만 선택해서 결과를 빠르게 좁힐 수 있습니다.
            </p>
          </div>
          <button
            onClick={onClose}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border text-muted hover:border-accent hover:text-accent"
            aria-label="필터 닫기"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="mt-5 flex flex-col gap-3 border-b border-border pb-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="text-sm text-muted">
            {hasActiveFilters
              ? `현재 ${selectedIndustry.size + selectedProcess.size}개 필터 선택됨`
              : "선택된 필터가 없습니다."}
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <button
              onClick={onClearFilters}
              disabled={!hasActiveFilters}
              className="rounded-full border border-border px-5 py-2.5 text-sm font-medium text-muted hover:text-foreground disabled:cursor-not-allowed disabled:opacity-40"
            >
              필터 초기화
            </button>
            <button
              onClick={onClose}
              className="rounded-full bg-foreground px-5 py-2.5 text-sm font-medium text-background hover:opacity-90"
            >
              닫기
            </button>
          </div>
        </div>

        <div className="catalog-filter-scrollbar mt-6 flex-1 overflow-y-auto pr-1">
          <div className="space-y-6">
            <FilterSection
              title="Industry"
              tags={industryTags}
              selectedTags={selectedIndustry}
              onToggle={onToggleIndustry}
            />
            <FilterSection
              title="Process"
              tags={processTags}
              selectedTags={selectedProcess}
              onToggle={onToggleProcess}
            />
          </div>
        </div>
      </div>
    </dialog>
  );
}

type FilterSectionProps = {
  title: string;
  tags: string[];
  selectedTags: Set<string>;
  onToggle: (tag: string) => void;
};

function FilterSection({ title, tags, selectedTags, onToggle }: FilterSectionProps) {
  return (
    <section>
      <p className="mb-3 text-xs font-medium uppercase tracking-wider text-muted">{title}</p>
      <div className="flex flex-wrap gap-2">
        {tags.map((tag) => (
          <button
            key={tag}
            onClick={() => onToggle(tag)}
            className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
              selectedTags.has(tag)
                ? "bg-accent text-white"
                : "bg-foreground/5 text-muted hover:text-foreground"
            }`}
          >
            {tag}
          </button>
        ))}
      </div>
    </section>
  );
}
