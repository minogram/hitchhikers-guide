import { requireRole } from "@/lib/auth-guard";
import { getAdminPosts } from "@/app/actions/admin-posts";
import Link from "next/link";
import { ArrowLeft, FileText } from "lucide-react";
import { AdminPostList } from "./AdminPostList";

export default async function AdminPostsPage() {
  await requireRole("admin", "manager");
  const posts = await getAdminPosts();

  return (
    <div className="mx-auto max-w-6xl px-6 py-12 lg:px-8">
      <Link
        href="/admin"
        className="inline-flex items-center gap-2 text-sm text-muted hover:text-foreground transition-colors mb-8"
      >
        <ArrowLeft className="h-4 w-4" />
        대시보드로 돌아가기
      </Link>

      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <FileText className="h-6 w-6 text-accent" />
          <h1 className="font-serif text-3xl font-bold tracking-tight">
            콘텐츠 관리
          </h1>
        </div>
        <p className="text-muted">
          게시글을 관리하고 고정/삭제합니다. 총 {posts.length}건
        </p>
      </div>

      <AdminPostList posts={posts} />
    </div>
  );
}
