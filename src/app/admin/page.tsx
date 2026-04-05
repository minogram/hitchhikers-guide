import Link from "next/link";
import { Users, AppWindow, FileText, Settings, Shield, Plus } from "lucide-react";
import { requireRole } from "@/lib/auth-guard";
import { getAdminStats, getUsers } from "@/app/actions/admin";

export default async function AdminPage() {
  await requireRole("admin");
  const [stats, users] = await Promise.all([getAdminStats(), getUsers()]);

  return (
    <div className="mx-auto max-w-6xl px-6 py-12 lg:px-8">
      {/* Header */}
      <div className="mb-12">
        <p className="text-sm font-medium text-accent uppercase tracking-widest mb-2">
          Admin Dashboard
        </p>
        <h1 className="font-serif text-4xl font-bold tracking-tight">
          관리자 대시보드
        </h1>
        <p className="mt-4 text-muted">
          사이트 콘텐츠와 사용자를 관리합니다.
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-12">
        {[
          { label: "전체 사용자", value: stats?.userCount ?? 0, icon: Users },
          { label: "등록된 앱", value: stats?.appCount ?? 0, icon: AppWindow },
          { label: "게시글", value: stats?.postCount ?? 0, icon: FileText },
          { label: "매니저", value: stats?.managerCount ?? 0, icon: Shield },
        ].map((stat) => (
          <div
            key={stat.label}
            className="rounded-2xl border border-border bg-card p-6"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-accent/10">
                <stat.icon className="h-5 w-5 text-accent" />
              </div>
            </div>
            <p className="text-2xl font-bold">{stat.value}</p>
            <p className="text-sm text-muted">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Link
          href="/admin/apps"
          className="group rounded-2xl border border-border bg-card p-6 hover:bg-card-hover transition-colors"
        >
          <div className="flex items-center gap-3 mb-4">
            <AppWindow className="h-6 w-6 text-accent" />
            <h3 className="text-lg font-bold">앱 카탈로그 관리</h3>
          </div>
          <p className="text-sm text-muted mb-4">
            AI 앱을 등록, 수정, 삭제합니다.
          </p>
          <span className="inline-flex items-center gap-1 text-sm font-medium text-accent">
            <Plus className="h-4 w-4" />
            새 앱 등록
          </span>
        </Link>

        <Link
          href="/admin/users"
          className="group rounded-2xl border border-border bg-card p-6 hover:bg-card-hover transition-colors"
        >
          <div className="flex items-center gap-3 mb-4">
            <Users className="h-6 w-6 text-accent" />
            <h3 className="text-lg font-bold">사용자 관리</h3>
          </div>
          <p className="text-sm text-muted mb-4">
            회원 등급을 조정하고 매니저를 임명합니다.
          </p>
          <span className="inline-flex items-center gap-1 text-sm font-medium text-accent">
            <Shield className="h-4 w-4" />
            권한 관리
          </span>
        </Link>

        <Link
          href="/admin/posts"
          className="group rounded-2xl border border-border bg-card p-6 hover:bg-card-hover transition-colors"
        >
          <div className="flex items-center gap-3 mb-4">
            <FileText className="h-6 w-6 text-accent" />
            <h3 className="text-lg font-bold">콘텐츠 관리</h3>
          </div>
          <p className="text-sm text-muted mb-4">
            게시글과 댓글을 관리합니다.
          </p>
          <span className="inline-flex items-center gap-1 text-sm font-medium text-accent">
            <Settings className="h-4 w-4" />
            관리하기
          </span>
        </Link>
      </div>

      {/* Recent Users */}
      <section className="mt-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold">최근 가입 사용자</h2>
          <Link href="/admin/users" className="text-sm text-accent hover:underline">
            전체 보기
          </Link>
        </div>
        <div className="rounded-2xl border border-border bg-card overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-card-hover">
                <th className="text-left px-6 py-3 font-medium text-muted">이름</th>
                <th className="text-left px-6 py-3 font-medium text-muted">이메일</th>
                <th className="text-left px-6 py-3 font-medium text-muted">등급</th>
                <th className="text-left px-6 py-3 font-medium text-muted">가입일</th>
              </tr>
            </thead>
            <tbody>
              {users.slice(0, 5).map((user) => (
                <tr key={user.id} className="border-b border-border last:border-0">
                  <td className="px-6 py-4 font-medium">{user.name}</td>
                  <td className="px-6 py-4 text-muted">{user.email}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        user.role === "admin"
                          ? "bg-red-500/10 text-red-500"
                          : user.role === "manager"
                          ? "bg-purple-500/10 text-purple-500"
                          : "bg-foreground/5 text-muted"
                      }`}
                    >
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-muted">
                    {new Date(user.createdAt).toLocaleDateString("ko-KR")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
