import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Clock, MessageCircle, User } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { DeletePostButton } from "./DeletePostButton";
import { CommentSection } from "./CommentSection";
import { SafeHtml } from "@/components/SafeHtml";
import type { Metadata } from "next";

const typeLabel: Record<string, string> = {
  notice: "공지사항",
  forum: "포럼",
  job: "구인구직",
  article: "아티클",
};

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const post = await prisma.post.findUnique({
    where: { id },
    select: { title: true, content: true, type: true },
  });
  if (!post) return { title: "게시글을 찾을 수 없습니다" };

  const plainContent = post.content.replace(/<[^>]*>/g, "").slice(0, 160);

  return {
    title: `${post.title} | 커뮤니티`,
    description: plainContent,
    openGraph: {
      title: post.title,
      description: plainContent,
    },
  };
}

export default async function PostDetailPage({ params }: Props) {
  const { id } = await params;
  const post = await prisma.post.findUnique({
    where: { id },
    include: {
      author: { select: { name: true } },
      comments: {
        orderBy: { createdAt: "asc" },
        include: { author: { select: { name: true } } },
      },
    },
  });

  if (!post) {
    notFound();
  }

  const session = await auth().catch(() => null);
  const currentUserId = session?.user?.id;
  const role = (session?.user?.role as string) ?? "";
  const isPrivileged = role === "admin" || role === "manager";

  if (!post.isVisible && !isPrivileged) {
    notFound();
  }

  const isOwner = currentUserId === post.authorId;
  const adminOnlyTypes = ["notice", "article"];
  const canModify = adminOnlyTypes.includes(post.type)
    ? isPrivileged
    : isOwner || isPrivileged;

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
              {post.author.name}
            </span>
            <span className="inline-flex items-center gap-1">
              <Clock className="h-4 w-4" />
              {post.createdAt.toLocaleDateString("en-CA")}
            </span>
            <span className="inline-flex items-center gap-1">
              <MessageCircle className="h-4 w-4" />
              {post.comments.length}개의 댓글
            </span>
          </div>
        </div>

        {canModify && (
          <div className="flex gap-2 mb-6">
            <Link
              href={`/community/${post.id}/edit`}
              className="rounded-lg border border-border px-4 py-2 text-sm font-medium hover:bg-card transition-colors"
            >
              수정
            </Link>
            <DeletePostButton postId={post.id} />
          </div>
        )}

        <div className="border-t border-border pt-8 mb-12">
          <SafeHtml html={post.content} />
        </div>

        {/* Comments Section */}
        <CommentSection
          postId={post.id}
          comments={post.comments.map((c) => ({
            id: c.id,
            content: c.content,
            authorId: c.authorId,
            authorName: c.author.name,
            createdAt: c.createdAt.toISOString(),
          }))}
          currentUserId={currentUserId}
          isPrivileged={isPrivileged}
          isLoggedIn={!!session?.user}
        />
      </article>
    </div>
  );
}
