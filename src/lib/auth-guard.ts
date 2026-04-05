import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import type { UserRole } from "@/lib/types";

/**
 * Require authentication. Redirects to /login if not authenticated.
 * Returns the session (guaranteed non-null).
 */
export async function requireAuth() {
  const session = await auth();
  if (!session?.user) {
    redirect("/login");
  }
  return session;
}

/**
 * Require a specific role (or higher).
 * Role hierarchy: admin > manager > user
 */
export async function requireRole(...allowed: UserRole[]) {
  const session = await requireAuth();
  const role = session.user.role as UserRole;

  if (!allowed.includes(role)) {
    redirect("/");
  }
  return session;
}
