import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Zap, Users, BookOpen, Bell } from "lucide-react";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { LikeButton } from "@/components/LikeButton";
import { HeroSlider } from "@/components/HeroSlider";

export default async function Home() {
  const session = await auth().catch(() => null);
  const userId = session?.user?.id ?? null;

  const [popularApps, newApps, pinnedNotices, tagOptions] = await Promise.all([
    prisma.appCard.findMany({
      take: 3,
      where: { isVisible: true },
      orderBy: { likeCount: "desc" },
      include: userId ? { likes: { where: { userId }, select: { userId: true } } } : undefined,
    }),
    prisma.appCard.findMany({
      take: 3,
      where: { isVisible: true },
      orderBy: { createdAt: "desc" },
      include: userId ? { likes: { where: { userId }, select: { userId: true } } } : undefined,
    }),
    prisma.post.findMany({
      where: { type: "notice", isPinned: true, isVisible: true },
      take: 3,
      orderBy: { createdAt: "desc" },
    }),
    prisma.tagOption.findMany({ where: { type: "industry" }, select: { label: true } }),
  ]);

  const industrySet = new Set(tagOptions.map((t) => t.label));

  function splitTags(app: { tags: string }) {
    const tags: string[] = JSON.parse(app.tags);
    return {
      industryTags: tags.filter((t) => industrySet.has(t)),
      processTags: tags.filter((t) => !industrySet.has(t)),
    };
  }
  return (
    <>
      {/* Hero Section */}
      <HeroSlider isLoggedIn={!!session?.user} />

      {/* Pinned Notices Section */}
      {pinnedNotices.length > 0 && (
        <section className="border-t border-border bg-card">
          <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-sm font-semibold text-accent uppercase tracking-widest">
                NOTICE
              </span>
              <Bell className="h-4 w-4 text-accent" />
            </div>
            <div className="space-y-2">
              {pinnedNotices.map((notice) => (
                <Link
                  key={notice.id}
                  href={`/community/${notice.id}`}
                  className="flex items-center gap-3 px-5 py-2 hover:bg-card-hover transition-colors group rounded-lg"
                >
                  <span className="font-medium text-sm truncate group-hover:text-accent transition-colors">
                    {notice.title}
                  </span>
                  <span className="ml-auto text-xs text-muted shrink-0">
                    {new Date(notice.createdAt).toLocaleDateString("en-CA")}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Features Section */}
      <section className="border-t border-border">
        <div className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
          <div className="grid grid-cols-1 gap-12 md:grid-cols-3">
            <div className="group">
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-transparent">
                <Zap className="h-6 w-6 text-accent" />
              </div>
              <h3 className="text-lg font-bold mb-2">AI 도구 큐레이션</h3>
              <p className="text-sm text-muted leading-relaxed">
                Fashion, Bags, Shoes, Beauty 등 산업별로 엄선된 AI 도구를
                카탈로그에서 탐색하세요.
              </p>
            </div>
            <div className="group">
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-transparent">
                <Users className="h-6 w-6 text-accent" />
              </div>
              <h3 className="text-lg font-bold mb-2">전문가 커뮤니티</h3>
              <p className="text-sm text-muted leading-relaxed">
                패션 테크 전문가들과 포럼에서 소통하고, 구인구직 게시판으로
                인재를 찾으세요.
              </p>
            </div>
            <div className="group">
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-transparent">
                <BookOpen className="h-6 w-6 text-accent" />
              </div>
              <h3 className="text-lg font-bold mb-2">인사이트 아티클</h3>
              <p className="text-sm text-muted leading-relaxed">
                AI 패션 분야의 깊이 있는 트렌드 분석과 전문 아티클을
                만나보세요.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Popular Apps */}
      <section className="border-t border-border bg-card">
        <div className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
          <div className="flex items-end justify-between mb-12">
            <div>
              <p className="text-sm font-medium text-accent uppercase tracking-widest mb-2">
                Popular
              </p>
              <h2 className="font-serif text-3xl font-bold tracking-tight sm:text-4xl">
                인기 AI 앱
              </h2>
            </div>
            <Link
              href="/catalog"
              className="hidden sm:inline-flex items-center gap-1 text-sm font-medium text-muted hover:text-foreground transition-colors"
            >
              전체 보기
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {popularApps.map((app, idx) => {
              const { industryTags, processTags } = splitTags(app);
              const isLiked = userId ? ((app as typeof app & { likes?: { userId: string }[] }).likes?.length ?? 0) > 0 : false;
              return (
                <Link
                  key={app.id}
                  href={`/catalog/${app.id}`}
                  className="group rounded-2xl border border-border bg-card p-6 hover:bg-card-hover transition-colors"
                >
                  <div className="aspect-[4/3] rounded-xl bg-background overflow-hidden mb-4">
                    <Image
                      src={app.thumbnail}
                      alt={app.title}
                      width={400}
                      height={300}
                      priority={idx === 0}
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <h3 className="text-lg font-bold group-hover:text-accent transition-colors leading-snug">
                      {app.title}
                    </h3>
                    <LikeButton appId={app.id} initialLiked={isLiked} initialCount={app.likeCount} size="sm" />
                  </div>
                  <p className="text-sm text-muted leading-relaxed line-clamp-2 mb-3">
                    {app.description}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {industryTags.map((tag) => (
                      <span key={tag} className="inline-block rounded-full bg-accent/10 px-3 py-1 text-xs font-medium text-accent">
                        {tag}
                      </span>
                    ))}
                    {processTags.map((tag) => (
                      <span key={tag} className="inline-block rounded-full bg-foreground/5 px-3 py-1 text-xs font-medium text-muted">
                        {tag}
                      </span>
                    ))}
                  </div>
                </Link>
              );
            })}
          </div>

          <div className="mt-8 text-center sm:hidden">
            <Link href="/catalog" className="inline-flex items-center gap-1 text-sm font-medium text-accent">
              전체 보기
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* New Apps */}
      <section className="border-t border-border">
        <div className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
          <div className="flex items-end justify-between mb-12">
            <div>
              <p className="text-sm font-medium text-accent uppercase tracking-widest mb-2">
                New
              </p>
              <h2 className="font-serif text-3xl font-bold tracking-tight sm:text-4xl">
                새로운 AI 앱
              </h2>
            </div>
            <Link
              href="/catalog"
              className="hidden sm:inline-flex items-center gap-1 text-sm font-medium text-muted hover:text-foreground transition-colors"
            >
              전체 보기
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {newApps.map((app) => {
              const { industryTags, processTags } = splitTags(app);
              const isLiked = userId ? ((app as typeof app & { likes?: { userId: string }[] }).likes?.length ?? 0) > 0 : false;
              return (
                <Link
                  key={app.id}
                  href={`/catalog/${app.id}`}
                  className="group rounded-2xl border border-border bg-background p-6 hover:bg-card-hover transition-colors"
                >
                  <div className="aspect-[4/3] rounded-xl bg-card overflow-hidden mb-4">
                    <Image
                      src={app.thumbnail}
                      alt={app.title}
                      width={400}
                      height={300}
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <h3 className="text-lg font-bold group-hover:text-accent transition-colors leading-snug">
                      {app.title}
                    </h3>
                    <LikeButton appId={app.id} initialLiked={isLiked} initialCount={app.likeCount} size="sm" />
                  </div>
                  <p className="text-sm text-muted leading-relaxed line-clamp-2 mb-3">
                    {app.description}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {industryTags.map((tag) => (
                      <span key={tag} className="inline-block rounded-full bg-accent/10 px-3 py-1 text-xs font-medium text-accent">
                        {tag}
                      </span>
                    ))}
                    {processTags.map((tag) => (
                      <span key={tag} className="inline-block rounded-full bg-foreground/5 px-3 py-1 text-xs font-medium text-muted">
                        {tag}
                      </span>
                    ))}
                  </div>
                </Link>
              );
            })}
          </div>

          <div className="mt-8 text-center sm:hidden">
            <Link href="/catalog" className="inline-flex items-center gap-1 text-sm font-medium text-accent">
              전체 보기
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="border-t border-border bg-foreground text-background">
        <div className="mx-auto max-w-7xl px-6 py-20 lg:px-8 text-center">
          <h2 className="font-serif text-3xl font-bold tracking-tight sm:text-4xl mb-4">
            패션의 미래를 함께 만들어가요
          </h2>
          <p className="text-background/60 mb-8 max-w-md mx-auto">
            패션 AI 커뮤니티에 참여하고 새로운 가능성을 발견하세요.
          </p>
          <Link
            href="/register"
            className="inline-flex items-center gap-2 rounded-full bg-accent px-8 py-3 text-sm font-semibold text-white hover:opacity-90 transition-opacity"
          >
            시작하기
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </>
  );
}
