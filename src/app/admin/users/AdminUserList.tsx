"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Search, Trash2 } from "lucide-react";
import { UserRoleSelect } from "./UserRoleSelect";
import { deleteUser } from "@/app/actions/admin";
import type { AdminUser } from "@/app/actions/admin";

export function AdminUserList({ users }: { users: AdminUser[] }) {
  const [query, setQuery] = useState("");
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  function handleDelete(user: AdminUser) {
    if (!confirm(`정말 "${user.name}" 사용자를 삭제하시겠습니까?\n이 사용자의 게시글, 댓글, 앱이 모두 삭제됩니다.`)) return;
    startTransition(async () => {
      const result = await deleteUser(user.id);
      if (result.error) {
        alert(result.error);
      } else {
        router.refresh();
      }
    });
  }

  const filtered = users.filter((user) => {
    if (!query) return true;
    const q = query.toLowerCase();
    return (
      user.name.toLowerCase().includes(q) ||
      user.email.toLowerCase().includes(q) ||
      user.role.toLowerCase().includes(q)
    );
  });

  return (
    <>
      <div className="mb-4">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="이름, 이메일, 등급으로 검색..."
            className="w-full rounded-xl border border-border bg-card pl-11 pr-4 py-3 text-sm outline-none focus:border-accent transition-colors placeholder:text-muted"
          />
        </div>
        {query && (
          <p className="mt-2 text-xs text-muted">
            검색 결과: {filtered.length}명
          </p>
        )}
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
            {filtered.map((user) => (
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
                  <div className="flex items-center gap-2">
                    {user.role !== "admin" ? (
                      <>
                        <UserRoleSelect userId={user.id} currentRole={user.role} />
                        <button
                          onClick={() => handleDelete(user)}
                          disabled={isPending}
                          className="p-1.5 rounded-lg text-red-500 hover:bg-red-500/10 transition-colors disabled:opacity-50"
                          title="사용자 삭제"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </>
                    ) : (
                      <span className="text-xs text-muted">—</span>
                    )}
                  </div>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-muted">
                  {query ? "검색 결과가 없습니다." : "등록된 사용자가 없습니다."}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}
