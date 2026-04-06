"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Search, Filter, Sparkles } from "lucide-react";
import { LikeButton } from "@/components/LikeButton";

type CatalogApp = {
  id: string;
  title: string;
  thumbnail: string;
  description: string;
  industryTags: string[];
  processTags: string[];
  hasGeminiDemo: boolean;
  likeCount: number;
  isLiked: boolean;
};

export default function CatalogPage() {
  const [apps, setApps] = useState<CatalogApp[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedIndustry, setSelectedIndustry] = useState<string | null>(null);
  const [selectedProcess, setSelectedProcess] = useState<string | null>(null);
  const [industryFilters, setIndustryFilters] = useState<string[]>([]);
  const [processFilters, setProcessFilters] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);

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
        setIndustryFilters(data.industry ?? []);
        setProcessFilters(data.process ?? []);
      });
  }, []);

  const filteredApps = apps.filter((app) => {
    const matchesSearch =
      !searchQuery ||
      app.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesIndustry =
      !selectedIndustry || app.industryTags.includes(selectedIndustry);
    const matchesProcess =
      !selectedProcess || app.processTags.includes(selectedProcess);
    return matchesSearch && matchesIndustry && matchesProcess;
  });

  return (
    <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
      {/* Page Header */}
      <div className="mb-12">
        <p className="text-sm font-medium text-accent uppercase tracking-widest mb-2">
          Catalog
        </p>
        <h1 className="font-serif text-4xl font-bold tracking-tight sm:text-5xl">
          AI App 카탈로그
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
              className="w-full rounded-full border border-border bg-card pl-11 pr-4 py-3 text-sm outline-none focus:border-accent transition-colors placeholder:text-muted"
            />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`inline-flex items-center gap-2 rounded-full border px-5 py-3 text-sm font-medium transition-colors ${
              showFilters || selectedIndustry || selectedProcess
                ? "border-accent text-accent bg-accent/5"
                : "border-border hover:bg-card-hover"
            }`}
          >
            <Filter className="h-4 w-4" />
            필터
          </button>
        </div>

        {/* Filter Tags */}
        {showFilters && (
          <div className="rounded-2xl border border-border bg-card p-6 space-y-4">
            <div>
              <h3 className="text-xs font-semibold uppercase tracking-wider text-muted mb-3">
                Industry
              </h3>
              <div className="flex flex-wrap gap-2">
                {industryFilters.map((tag) => (
                  <button
                    key={tag}
                    onClick={() =>
                      setSelectedIndustry(selectedIndustry === tag ? null : tag)
                    }
                    className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
                      selectedIndustry === tag
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
              <h3 className="text-xs font-semibold uppercase tracking-wider text-muted mb-3">
                Process
              </h3>
              <div className="flex flex-wrap gap-2">
                {processFilters.map((tag) => (
                  <button
                    key={tag}
                    onClick={() =>
                      setSelectedProcess(selectedProcess === tag ? null : tag)
                    }
                    className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
                      selectedProcess === tag
                        ? "bg-accent text-white"
                        : "bg-foreground/5 text-muted hover:text-foreground"
                    }`}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Results Count */}
      <p className="mb-6 text-sm text-muted">
        {loading ? "로딩 중..." : `${filteredApps.length}개의 앱`}
      </p>

      {/* App Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filteredApps.map((app) => (
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
            <div className="flex flex-wrap gap-2">
              {app.industryTags.map((tag) => (
                <span
                  key={tag}
                  className="inline-block rounded-full bg-accent/10 px-3 py-1 text-xs font-medium text-accent"
                >
                  {tag}
                </span>
              ))}
              {app.processTags.map((tag) => (
                <span
                  key={tag}
                  className="inline-block rounded-full bg-foreground/5 px-3 py-1 text-xs font-medium text-muted"
                >
                  {tag}
                </span>
              ))}
            </div>
          </Link>
        ))}
      </div>

      {filteredApps.length === 0 && (
        <div className="text-center py-20">
          <p className="text-muted">검색 결과가 없습니다.</p>
        </div>
      )}
    </div>
  );
}
