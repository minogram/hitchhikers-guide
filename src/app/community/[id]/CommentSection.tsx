"use client";

import { useState, useTransition } from "react";
import { createComment, deleteComment } from "@/app/actions/comments";
import { User, Trash2, Clock } from "lucide-react";

interface CommentData {
  id: string;
  content: string;
  authorId: string;
  authorName: string;
  createdAt: string;
}

interface Props {
  postId: string;
  comments: CommentData[];
  currentUserId?: string;
  isPrivileged: boolean;
  isLoggedIn: boolean;
}

export function CommentSection({
  postId,
  comments,
  currentUserId,
  isPrivileged,
  isLoggedIn,
}: Props) {
  const [content, setContent] = useState("");
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function handleSubmit() {
    if (!content.trim()) return;
    setError(null);
    startTransition(async () => {
      const result = await createComment(postId, content);
      if (result.error) {
        setError(result.error);
      } else {
        setContent("");
      }
    });
  }

  function handleDelete(commentId: string) {
    if (!confirm("댓글을 삭제하시겠습니까?")) return;
    startTransition(async () => {
      const result = await deleteComment(commentId);
      if (result.error) {
        setError(result.error);
      }
    });
  }

  return (
    <section className="border-t border-border pt-8">
      <h2 className="text-lg font-bold mb-6">댓글 {comments.length}개</h2>

      {/* Comment Form */}
      {isLoggedIn ? (
        <div className="rounded-xl border border-border bg-card p-4 mb-6">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="댓글을 작성하세요..."
            className="w-full resize-none bg-transparent text-sm outline-none placeholder:text-muted"
            rows={3}
          />
          {error && <p className="text-xs text-accent mt-1">{error}</p>}
          <div className="flex justify-end mt-2">
            <button
              onClick={handleSubmit}
              disabled={isPending || !content.trim()}
              className="rounded-full bg-foreground px-4 py-2 text-xs font-medium text-background hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              {isPending ? "작성 중..." : "댓글 작성"}
            </button>
          </div>
        </div>
      ) : (
        <div className="rounded-xl border border-border bg-card p-4 mb-6 text-center">
          <p className="text-sm text-muted py-2">
            로그인 후 댓글을 작성할 수 있습니다.
          </p>
        </div>
      )}

      {/* Comment List */}
      <div className="space-y-4">
        {comments.map((comment) => {
          const canDelete =
            currentUserId === comment.authorId || isPrivileged;

          return (
            <div
              key={comment.id}
              className="rounded-xl border border-border bg-card p-4"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3 text-sm">
                  <span className="inline-flex items-center gap-1 font-medium">
                    <User className="h-3.5 w-3.5" />
                    {comment.authorName}
                  </span>
                  <span className="inline-flex items-center gap-1 text-xs text-muted">
                    <Clock className="h-3 w-3" />
                    {new Date(comment.createdAt).toLocaleDateString("ko-KR")}
                  </span>
                </div>
                {canDelete && (
                  <button
                    onClick={() => handleDelete(comment.id)}
                    disabled={isPending}
                    className="text-muted hover:text-red-500 transition-colors disabled:opacity-50"
                    title="삭제"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>
              <p className="text-sm text-muted whitespace-pre-wrap">
                {comment.content}
              </p>
            </div>
          );
        })}
      </div>

      {comments.length === 0 && (
        <p className="text-center text-sm text-muted py-8">
          아직 댓글이 없습니다. 첫 댓글을 작성해보세요!
        </p>
      )}
    </section>
  );
}
