"use client";

import Link from "next/link";
import { useState } from "react";
import { MessageSquare, Briefcase, BookOpen, Bell, Clock, MessageCircle } from "lucide-react";
import { samplePosts } from "@/lib/data";
import type { BoardType } from "@/lib/types";

const tabs: { type: BoardType | "all"; label: string; icon: React.ReactNode }[] = [
  { type: "all", label: "전체", icon: null },
  { type: "notice", label: "공지사항", icon: <Bell className="h-4 w-4" /> },
  { type: "forum", label: "포럼", icon: <MessageSquare className="h-4 w-4" /> },
  { type: "job", label: "구인구직", icon: <Briefcase className="h-4 w-4" /> },
  { type: "article", label: "아티클", icon: <BookOpen className="h-4 w-4" /> },
];

const typeLabel: Record<BoardType, string> = {
  notice: "공지",
  forum: "포럼",
  job: "채용",
  article: "아티클",
};

const typeColor: Record<BoardType, string> = {
  notice: "bg-red-500/10 text-red-500",
  forum: "bg-blue-500/10 text-blue-500",
  job: "bg-green-500/10 text-green-500",
  article: "bg-purple-500/10 text-purple-500",
};

export default function CommunityPage() {
  const [activeTab, setActiveTab] = useState<BoardType | "all">("all");

  const filteredPosts =
    activeTab === "all"
      ? samplePosts
      : samplePosts.filter((p) => p.type === activeTab);

  return (
    <div className="mx-auto max-w-4xl px-6 py-12 lg:px-8">
      {/* Page Header */}
      <div className="mb-8">
        <p className="text-sm font-medium text-accent uppercase tracking-widest mb-2">
          Community
        </p>
        <h1 className="font-serif text-4xl font-bold tracking-tight sm:text-5xl">
          커뮤니티
        </h1>
        <p className="mt-4 text-muted">
          패션 AI 전문가들과 소통하고 인사이트를 나눠보세요.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
        {tabs.map((tab) => (
          <button
            key={tab.type}
            onClick={() => setActiveTab(tab.type)}
            className={`inline-flex items-center gap-2 whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition-colors ${
              activeTab === tab.type
                ? "bg-foreground text-background"
                : "bg-card border border-border text-muted hover:text-foreground"
            }`}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {/* Post List */}
      <div className="space-y-3">
        {filteredPosts.map((post) => (
          <Link
            key={post.id}
            href={`/community/${post.id}`}
            className="block rounded-xl border border-border bg-card p-5 hover:bg-card-hover transition-colors"
          >
            <div className="flex items-start gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-2">
                  <span
                    className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${
                      typeColor[post.type]
                    }`}
                  >
                    {typeLabel[post.type]}
                  </span>
                  {post.isPinned && (
                    <span className="text-xs text-accent font-medium">
                      📌 고정
                    </span>
                  )}
                </div>
                <h3 className="font-semibold mb-1 truncate">{post.title}</h3>
                <p className="text-sm text-muted line-clamp-1">
                  {post.content}
                </p>
                <div className="mt-3 flex items-center gap-4 text-xs text-muted">
                  <span>{post.authorName}</span>
                  <span className="inline-flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {post.createdAt.toLocaleDateString("ko-KR")}
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <MessageCircle className="h-3 w-3" />
                    {post.commentCount}
                  </span>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {filteredPosts.length === 0 && (
        <div className="text-center py-20">
          <p className="text-muted">게시글이 없습니다.</p>
        </div>
      )}
    </div>
  );
}
