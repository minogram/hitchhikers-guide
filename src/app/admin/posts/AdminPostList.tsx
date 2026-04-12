"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { Search, Pin, Trash2, Eye, EyeOff, Pencil } from "lucide-react";
import { togglePin, togglePostVisibility, adminDeletePost } from "@/app/actions/admin-posts";
import type { AdminPost } from "@/app/actions/admin-posts";
import { ConfirmDialog } from "@/components/ConfirmDialog";

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

export function AdminPostList({ posts: initialPosts }: { posts: AdminPost[] }) {
  const [query, setQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [posts, setPosts] = useState<AdminPost[]>(initialPosts);
  const [togglingVisibilityId, setTogglingVisibilityId] = useState<string | null>(null);
  const [togglingPinId, setTogglingPinId] = useState<string | null>(null);
  const [pinError, setPinError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; title: string } | null>(null);

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

  async function handleTogglePin(postId: string, postType: string) {
    setPinError(null);
    setTogglingPinId(postId);
    try {
      const result = await togglePin(postId);
      if (result?.error) {
        if (postType === "notice") {
          setPinError(result.error);
        }
      } else {
        setPosts((prev) => prev.map((p) => p.id === postId ? { ...p, isPinned: !p.isPinned } : p));
      }
    } finally {
      setTogglingPinId(null);
    }
  }

  async function handleToggleVisibility(postId: string) {
    setTogglingVisibilityId(postId);
    const result = await togglePostVisibility(postId);
    if (result.isVisible !== undefined) {
      setPosts((prev) => prev.map((p) => p.id === postId ? { ...p, isVisible: result.isVisible! } : p));
    }
    setTogglingVisibilityId(null);
  }

  function handleDelete(postId: string) {
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

      {pinError && (
        <div className="mb-4 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-500">
          {pinError}
        </div>
      )}

      <div className="rounded-2xl border border-border bg-card overflow-x-auto">
        <table className="w-full text-sm min-w-[640px]">
          <thead>
            <tr className="border-b border-border bg-card-hover">
              <th className="text-left px-6 py-3 font-medium text-muted">카테고리</th>
              <th className="text-left px-6 py-3 font-medium text-muted">제목</th>
              <th className="text-left px-6 py-3 font-medium text-muted">작성자</th>
              <th className="text-left px-6 py-3 font-medium text-muted">작성일</th>
              <th className="text-left px-6 py-3 font-medium text-muted">댓글</th>
              <th className="text-left px-6 py-3 font-medium text-muted">랜딩 고정</th>
              <th className="text-left px-6 py-3 font-medium text-muted">작업</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((post) => (
              <tr key={post.id} className={`border-b border-border last:border-0 transition-opacity ${post.isVisible ? '' : 'opacity-50'}`}>
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
                    {post.isPinned && post.type !== "notice" && <span className="mr-1">📌</span>}
                    {post.title}
                  </Link>
                </td>
                <td className="px-6 py-4 text-muted">{post.author.name}</td>
                <td className="px-6 py-4 text-muted">
                  {new Date(post.createdAt).toLocaleDateString("en-CA")}
                </td>
                <td className="px-6 py-4 text-muted">{post._count.comments}</td>
                <td className="px-6 py-4">
                  {post.type === "notice" ? (
                    <button
                      onClick={() => handleTogglePin(post.id, post.type)}
                      disabled={togglingPinId === post.id}
                      title={post.isPinned ? "랜딩 고정 해제" : "랜딩 페이지에 고정"}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none disabled:opacity-40 ${
                        post.isPinned ? "bg-accent" : "bg-border"
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-sm transition-transform ${
                          post.isPinned ? "translate-x-6" : "translate-x-1"
                        }`}
                      />
                    </button>
                  ) : (
                    <button
                      onClick={() => handleTogglePin(post.id, post.type)}
                      disabled={togglingPinId === post.id}
                      title={post.isPinned ? "고정 해제" : "고정"}
                      className={`p-1.5 rounded-lg transition-colors disabled:opacity-50 ${
                        post.isPinned
                          ? "text-accent hover:bg-accent/10"
                          : "text-muted hover:text-foreground hover:bg-card-hover"
                      }`}
                    >
                      <Pin className="h-4 w-4" />
                    </button>
                  )}
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleToggleVisibility(post.id)}
                      disabled={togglingVisibilityId === post.id}
                      title={post.isVisible ? '숨기기' : '노출하기'}
                      className={`p-1.5 rounded-lg transition-colors disabled:opacity-40 ${
                        post.isVisible
                          ? 'text-green-600 hover:bg-green-500/10'
                          : 'text-muted hover:bg-muted/10'
                      }`}
                    >
                      {post.isVisible ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                    </button>
                    <Link
                      href={`/community/${post.id}/edit`}
                      title="수정"
                      className="p-1.5 rounded-lg text-muted hover:text-accent hover:bg-accent/10 transition-colors"
                    >
                      <Pencil className="h-4 w-4" />
                    </Link>
                    <button
                      onClick={() => setDeleteTarget({ id: post.id, title: post.title })}
                      disabled={isPending}
                      title="삭제"
                      className="p-1.5 rounded-lg text-red-500 hover:bg-red-500/10 transition-colors disabled:opacity-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={7} className="px-6 py-12 text-center text-muted">
                  {query || typeFilter !== "all"
                    ? "검색 결과가 없습니다."
                    : "게시글이 없습니다."}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <ConfirmDialog
        open={!!deleteTarget}
        title="게시글 삭제"
        description={deleteTarget ? `"${deleteTarget.title}" 게시글을 삭제하시겠습니까?` : ""}
        confirmLabel="삭제"
        onConfirm={() => { const id = deleteTarget?.id; setDeleteTarget(null); if (id) handleDelete(id); }}
        onCancel={() => setDeleteTarget(null)}
      />
    </>
  );
}
