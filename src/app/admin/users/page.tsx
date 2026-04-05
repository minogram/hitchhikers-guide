import { requireRole } from "@/lib/auth-guard";
import { getUsers } from "@/app/actions/admin";
import Link from "next/link";
import { ArrowLeft, Users } from "lucide-react";
import { UserRoleSelect } from "./UserRoleSelect";

export default async function AdminUsersPage() {
  await requireRole("admin");
  const users = await getUsers();

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
          <Users className="h-6 w-6 text-accent" />
          <h1 className="font-serif text-3xl font-bold tracking-tight">
            사용자 관리
          </h1>
        </div>
        <p className="text-muted">
          회원 등급을 조정하고 매니저를 임명합니다. 총 {users.length}명
        </p>
      </div>

      <div className="rounded-2xl border border-border bg-card overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-card-hover">
              <th className="text-left px-6 py-3 font-medium text-muted">이름</th>
              <th className="text-left px-6 py-3 font-medium text-muted">이메일</th>
              <th className="text-left px-6 py-3 font-medium text-muted">등급</th>
              <th className="text-left px-6 py-3 font-medium text-muted">가입일</th>
              <th className="text-left px-6 py-3 font-medium text-muted">작업</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
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
                <td className="px-6 py-4">
                  {user.role !== "admin" ? (
                    <UserRoleSelect userId={user.id} currentRole={user.role} />
                  ) : (
                    <span className="text-xs text-muted">—</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
