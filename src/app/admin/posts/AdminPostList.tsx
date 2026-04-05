"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { Search, Pin, Trash2 } from "lucide-react";
import { togglePin, adminDeletePost } from "@/app/actions/admin-posts";
import type { AdminPost } from "@/app/actions/admin-posts";

const typeLabel: Record<string, string> = {
  notice: "공지",
  forum: "포럼",
  job: "채용",
  article: "아티클",
};

const typeColor: Record<string, string> = {
  notice: "bg-red-500/10 text-red-500",
  forum: "bg-blue-500/10 text-blue-500",
  job: "bg-green-500/10 text-green-500",
  article: "bg-purple-500/10 text-purple-500",
};

export function AdminPostList({ posts }: { posts: AdminPost[] }) {
  const [query, setQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [isPending, startTransition] = useTransition();

  const filtered = posts.filter((post) => {
    const matchesType = typeFilter === "all" || post.type === typeFilter;
    if (!matchesType) return false;
    if (!query) return true;
    const q = query.toLowerCase();
    return (
      post.title.toLowerCase().includes(q) ||
      post.author.name.toLowerCase().includes(q)
    );
  });

  function handleTogglePin(postId: string) {
    startTransition(async () => {
      await togglePin(postId);
    });
  }

  function handleDelete(postId: string, title: string) {
    if (!confirm(`"${title}" 게시글을 삭제하시겠습니까?`)) return;
    startTransition(async () => {
      await adminDeletePost(postId);
    });
  }

  return (
    <>
      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="제목, 작성자로 검색..."
            className="w-full rounded-xl border border-border bg-card pl-11 pr-4 py-3 text-sm outline-none focus:border-accent transition-colors placeholder:text-muted"
          />
        </div>
        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          className="rounded-xl border border-border bg-card px-4 py-3 text-sm outline-none focus:border-accent transition-colors"
        >
          <option value="all">전체 카테고리</option>
          <option value="notice">공지사항</option>
          <option value="forum">포럼</option>
          <option value="job">구인구직</option>
          <option value="article">아티클</option>
        </select>
      </div>

      {query || typeFilter !== "all" ? (
        <p className="mb-4 text-xs text-muted">검색 결과: {filtered.length}건</p>
      ) : null}

      <div className="rounded-2xl border border-border bg-card overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-card-hover">
              <th className="text-left px-6 py-3 font-medium text-muted">카테고리</th>
              <th className="text-left px-6 py-3 font-medium text-muted">제목</th>
              <th className="text-left px-6 py-3 font-medium text-muted">작성자</th>
              <th className="text-left px-6 py-3 font-medium text-muted">댓글</th>
              <th className="text-left px-6 py-3 font-medium text-muted">작성일</th>
              <th className="text-left px-6 py-3 font-medium text-muted">작업</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((post) => (
              <tr key={post.id} className="border-b border-border last:border-0">
                <td className="px-6 py-4">
                  <span
                    className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${
                      typeColor[post.type] ?? "bg-foreground/5 text-muted"
                    }`}
                  >
                    {typeLabel[post.type] ?? post.type}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <Link
                    href={`/community/${post.id}`}
                    className="font-medium hover:text-accent transition-colors"
                  >
                    {post.isPinned && <span className="mr-1">📌</span>}
                    {post.title}
                  </Link>
                </td>
                <td className="px-6 py-4 text-muted">{post.author.name}</td>
                <td className="px-6 py-4 text-muted">{post._count.comments}</td>
                <td className="px-6 py-4 text-muted">
                  {new Date(post.createdAt).toLocaleDateString("ko-KR")}
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleTogglePin(post.id)}
                      disabled={isPending}
                      className={`inline-flex items-center gap-1 rounded-lg border px-2.5 py-1 text-xs transition-colors disabled:opacity-50 ${
                        post.isPinned
                          ? "border-accent/30 text-accent hover:bg-accent/10"
                          : "border-border text-muted hover:text-foreground hover:bg-card-hover"
                      }`}
                      title={post.isPinned ? "고정 해제" : "고정"}
                    >
                      <Pin className="h-3 w-3" />
                      {post.isPinned ? "해제" : "고정"}
                    </button>
                    <Link
                      href={`/community/${post.id}/edit`}
                      className="rounded-lg border border-border px-2.5 py-1 text-xs text-muted hover:text-foreground hover:bg-card-hover transition-colors"
                    >
                      수정
                    </Link>
                    <button
                      onClick={() => handleDelete(post.id, post.title)}
                      disabled={isPending}
                      className="inline-flex items-center gap-1 rounded-lg border border-red-500/30 text-red-500 px-2.5 py-1 text-xs hover:bg-red-500/10 transition-colors disabled:opacity-50"
                    >
                      <Trash2 className="h-3 w-3" />
                      삭제
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center text-muted">
                  {query || typeFilter !== "all"
                    ? "검색 결과가 없습니다."
                    : "게시글이 없습니다."}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}
