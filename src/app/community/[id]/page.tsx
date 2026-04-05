import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Clock, MessageCircle, User } from "lucide-react";
import { samplePosts } from "@/lib/data";

const typeLabel: Record<string, string> = {
  notice: "공지사항",
  forum: "포럼",
  job: "구인구직",
  article: "아티클",
};

interface Props {
  params: Promise<{ id: string }>;
}

export default async function PostDetailPage({ params }: Props) {
  const { id } = await params;
  const post = samplePosts.find((p) => p.id === id);

  if (!post) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-3xl px-6 py-12 lg:px-8">
      <Link
        href="/community"
        className="inline-flex items-center gap-2 text-sm text-muted hover:text-foreground transition-colors mb-8"
      >
        <ArrowLeft className="h-4 w-4" />
        커뮤니티로 돌아가기
      </Link>

      <article>
        <div className="mb-6">
          <span className="inline-block rounded-full bg-accent/10 px-3 py-1 text-xs font-medium text-accent mb-3">
            {typeLabel[post.type]}
          </span>
          <h1 className="font-serif text-3xl font-bold tracking-tight mb-4">
            {post.title}
          </h1>
          <div className="flex items-center gap-4 text-sm text-muted">
            <span className="inline-flex items-center gap-1">
              <User className="h-4 w-4" />
              {post.authorName}
            </span>
            <span className="inline-flex items-center gap-1">
              <Clock className="h-4 w-4" />
              {post.createdAt.toLocaleDateString("ko-KR")}
            </span>
            <span className="inline-flex items-center gap-1">
              <MessageCircle className="h-4 w-4" />
              {post.commentCount}개의 댓글
            </span>
          </div>
        </div>

        <div className="border-t border-border pt-8 mb-12">
          <p className="text-muted leading-relaxed whitespace-pre-wrap">
            {post.content}
          </p>
        </div>

        {/* Comments Section */}
        <section className="border-t border-border pt-8">
          <h2 className="text-lg font-bold mb-6">
            댓글 {post.commentCount}개
          </h2>
          <div className="rounded-xl border border-border bg-card p-4 mb-6">
            <textarea
              placeholder="댓글을 작성하세요... (로그인 필요)"
              className="w-full resize-none bg-transparent text-sm outline-none placeholder:text-muted"
              rows={3}
              disabled
            />
            <div className="flex justify-end mt-2">
              <button
                disabled
                className="rounded-full bg-foreground/50 px-4 py-2 text-xs font-medium text-background cursor-not-allowed"
              >
                댓글 작성
              </button>
            </div>
          </div>
          <p className="text-center text-sm text-muted py-8">
            로그인 후 댓글을 작성할 수 있습니다.
          </p>
        </section>
      </article>
    </div>
  );
}
