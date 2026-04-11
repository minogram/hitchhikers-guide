import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ExternalLink, Sparkles, Pencil } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { LikeButton } from "@/components/LikeButton";
import { BackToCatalog } from "./BackToCatalog";
import { SafeHtml } from "@/components/SafeHtml";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function AppDetailPage({ params }: Props) {
  const { id } = await params;
  const app = await prisma.appCard.findUnique({ where: { id } });

  if (!app) {
    notFound();
  }

  const session = await auth().catch(() => null);
  const role = session?.user?.role;
  const isPrivileged = role === "admin" || role === "manager";
  const userId = session?.user?.id ?? null;

  if (!app.isVisible && !isPrivileged) {
    notFound();
  }

  const isLiked = userId
    ? !!(await prisma.appLike.findUnique({ where: { userId_appId: { userId, appId: id } } }))
    : false;

  const tags: string[] = JSON.parse(app.tags);

  return (
    <div className="mx-auto max-w-4xl px-6 py-12 lg:px-8">
      {/* Back Link */}
      <div className="flex items-center justify-between mb-8">
        <BackToCatalog />
        {isPrivileged && (
          <Link
            href={`/admin/apps/${app.id}/edit`}
            className="inline-flex items-center gap-1.5 rounded-full border border-border px-4 py-2 text-sm font-medium hover:bg-card-hover transition-colors"
          >
            <Pencil className="h-3.5 w-3.5" />
            수정
          </Link>
        )}
      </div>

      {/* App Header */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 mb-12">
        <div className="aspect-[4/3] rounded-2xl bg-card border border-border overflow-hidden">
          <Image
            src={app.thumbnail}
            alt={app.title}
            width={600}
            height={450}
            className="h-full w-full object-cover"
            priority
          />
        </div>
        <div className="flex flex-col justify-center">
          <div className="flex flex-wrap gap-2 mb-4">
            {tags.map((tag: string) => (
              <span
                key={tag}
                className="inline-block rounded-full bg-accent/10 px-3 py-1 text-xs font-medium text-accent"
              >
                {tag}
              </span>
            ))}
          </div>
          <h1 className="font-serif text-3xl font-bold tracking-tight sm:text-4xl mb-4">
            {app.title}
          </h1>
          <p className="text-muted leading-relaxed mb-6">
            {app.description}
          </p>
          <div className="flex gap-3 flex-wrap">
            <a
              href={userId ? app.link : `/login?callbackUrl=/catalog/${app.id}`}
              target={userId ? "_blank" : "_self"}
              rel={userId ? "noopener noreferrer" : undefined}
              className="inline-flex items-center gap-2 rounded-full bg-foreground px-6 py-3 text-sm font-semibold text-background hover:opacity-90 transition-opacity"
            >
              바로가기
              <ExternalLink className="h-4 w-4" />
            </a>
            {app.hasGeminiDemo && (
              <button className="inline-flex items-center gap-2 rounded-full border border-accent px-6 py-3 text-sm font-semibold text-accent hover:bg-accent/5 transition-colors">
                <Sparkles className="h-4 w-4" />
                AI 데모
              </button>
            )}
            <LikeButton
              appId={app.id}
              initialLiked={isLiked}
              initialCount={app.likeCount}
            />
          </div>
        </div>
      </div>

      {/* Detailed Description */}
      <section className="border-t border-border pt-8 mb-12">
        <h2 className="text-xl font-bold mb-4">상세 설명</h2>
        <SafeHtml html={app.detailDescription || app.description} />
      </section>

      {/* Gemini Demo Section */}
      {app.hasGeminiDemo && (
        <section className="rounded-2xl border border-border bg-card p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-accent/10">
              <Sparkles className="h-5 w-5 text-accent" />
            </div>
            <div>
              <h2 className="text-lg font-bold">Gemini AI 데모</h2>
              <p className="text-sm text-muted">
                이 앱의 AI 기능을 직접 체험해보세요.
              </p>
            </div>
          </div>
          <div className="rounded-xl border border-border bg-background p-6">
            <textarea
              placeholder="패션 관련 프롬프트를 입력하세요... (예: 2025년 봄/여름 트렌드 컬러 추천)"
              className="w-full resize-none rounded-lg border border-border bg-card p-4 text-sm outline-none focus:border-accent transition-colors placeholder:text-muted"
              rows={3}
            />
            <div className="mt-4 flex justify-end">
              <button className="inline-flex items-center gap-2 rounded-full bg-accent px-6 py-2.5 text-sm font-semibold text-white hover:opacity-90 transition-opacity">
                <Sparkles className="h-4 w-4" />
                생성하기
              </button>
            </div>
            <div className="mt-4 rounded-lg border border-dashed border-border p-8 text-center text-sm text-muted">
              Gemini API 연동 후 결과가 여기에 표시됩니다.
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
