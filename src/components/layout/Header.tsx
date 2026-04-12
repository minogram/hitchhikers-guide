"use client";

import Link from "next/link";
import { useState } from "react";
import { useSession, signOut } from "next-auth/react";
import { usePathname } from "next/navigation";
import { Menu, X, Sparkles, LogOut, Shield, UserCircle, Sun, Moon } from "lucide-react";
import { useTheme } from "@/components/ThemeProvider";

const navigation = [
  { name: "AI APPS", href: "/catalog" },
  { name: "COMMUNITY", href: "/community" },
  { name: "ABOUT", href: "/about" },
];

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { data: session } = useSession();
  const { resolvedTheme, setTheme } = useTheme();
  const pathname = usePathname();
  const isAdmin = session?.user?.role === "admin";
  const isManager = session?.user?.role === "manager";

  function toggleTheme() {
    setTheme(resolvedTheme === "dark" ? "light" : "dark");
  }

  return (
    <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-md">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-8">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <Sparkles className="h-6 w-6 text-accent" />
          <span className="font-serif text-xl font-bold tracking-tight">
            HGFAI
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex md:items-center md:gap-8">
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={`text-sm font-medium transition-colors ${
                pathname.startsWith(item.href)
                  ? "text-foreground"
                  : "text-muted hover:text-foreground"
              }`}
            >
              {item.name}
            </Link>
          ))}
          {(isAdmin || isManager) && (
            <Link
              href="/admin"
              className={`inline-flex items-center gap-1 text-sm font-medium transition-colors ${
                pathname.startsWith("/admin")
                  ? "text-foreground"
                  : "text-accent hover:text-foreground"
              }`}
            >
              <Shield className="h-3.5 w-3.5" />
              관리
            </Link>
          )}
        </div>

        {/* Auth Buttons */}
        <div className="hidden md:flex md:items-center md:gap-4">
          <button
            onClick={toggleTheme}
            className="rounded-full p-2 text-muted hover:text-foreground hover:bg-card transition-colors"
            title={resolvedTheme === "dark" ? "라이트 모드" : "다크 모드"}
          >
            {resolvedTheme === "dark" ? (
              <Sun className="h-4 w-4" />
            ) : (
              <Moon className="h-4 w-4" />
            )}
          </button>
          {session?.user ? (
            <>
              <Link
                href="/mypage"
                className="inline-flex items-center gap-1.5 text-sm text-muted hover:text-foreground transition-colors"
              >
                <UserCircle className="h-4 w-4" />
                {session.user.name}
                {(isAdmin || isManager) && (
                  <span className="inline-block rounded-full bg-accent/10 px-2 py-0.5 text-xs font-medium text-accent">
                    {session.user.role}
                  </span>
                )}
              </Link>
              <button
                onClick={() => signOut({ callbackUrl: "/" })}
                className="inline-flex items-center gap-1.5 text-sm font-medium text-muted hover:text-foreground transition-colors"
              >
                <LogOut className="h-4 w-4" />
                로그아웃
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="text-sm font-medium text-muted hover:text-foreground transition-colors"
              >
                로그인
              </Link>
              <Link
                href="/register"
                className="rounded-full bg-foreground px-4 py-2 text-sm font-medium text-background hover:opacity-90 transition-opacity"
              >
                회원가입
              </Link>
            </>
          )}
        </div>

        {/* Mobile menu button */}
        <button
          className="md:hidden"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-expanded={mobileMenuOpen}
          aria-label="메뉴"
        >
          {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </nav>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-border bg-background">
          <div className="px-6 py-4 space-y-3">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`block text-sm font-medium ${
                  pathname.startsWith(item.href)
                    ? "text-foreground"
                    : "text-muted hover:text-foreground"
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}
            {(isAdmin || isManager) && (
              <Link
                href="/admin"
                className="block text-sm font-medium text-accent hover:text-foreground"
                onClick={() => setMobileMenuOpen(false)}
              >
                관리자
              </Link>
            )}
            <hr className="border-border" />
            {session?.user ? (
              <>
                <Link
                  href="/mypage"
                  className="inline-flex items-center gap-1.5 text-sm font-medium text-muted hover:text-foreground"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <UserCircle className="h-4 w-4" />
                  {session.user.name}{(isAdmin || isManager) && ` (${session.user.role})`}
                </Link>
                <button
                  onClick={() => {
                    signOut({ callbackUrl: "/" });
                    setMobileMenuOpen(false);
                  }}
                  className="block text-sm font-medium text-muted hover:text-foreground"
                >
                  로그아웃
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="block text-sm font-medium text-muted hover:text-foreground"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  로그인
                </Link>
                <Link
                  href="/register"
                  className="block text-sm font-medium text-accent hover:text-foreground"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  회원가입
                </Link>
              </>
            )}
            <hr className="border-border" />
            <button
              onClick={toggleTheme}
              className="inline-flex items-center gap-2 text-sm font-medium text-muted hover:text-foreground"
            >
              {resolvedTheme === "dark" ? (
                <Sun className="h-4 w-4" />
              ) : (
                <Moon className="h-4 w-4" />
              )}
              {resolvedTheme === "dark" ? "라이트 모드" : "다크 모드"}
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
