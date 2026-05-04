"use client";

import Link from "next/link";
import { useActionState } from "react";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { Mail, Lock, User, ArrowRight, CheckCircle } from "lucide-react";
import { signup } from "@/app/actions/auth";
import { PasswordRequirementList } from "@/components/PasswordRequirementList";

type EmailCheckStatus = "idle" | "invalid" | "checking" | "available" | "taken" | "error";

export default function RegisterPage() {
  const [state, action, pending] = useActionState(signup, undefined);
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [emailCheckStatus, setEmailCheckStatus] = useState<EmailCheckStatus>("idle");
  const [emailCheckMessage, setEmailCheckMessage] = useState("");
  const [password, setPassword] = useState("");

  const normalizedEmail = useMemo(() => email.trim(), [email]);

  useEffect(() => {
    if (state?.success) {
      const timer = setTimeout(() => router.push("/login"), 1500);
      return () => clearTimeout(timer);
    }
  }, [state?.success, router]);

  useEffect(() => {
    if (!normalizedEmail) {
      setEmailCheckStatus("idle");
      setEmailCheckMessage("");
      return;
    }

    const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail);
    if (!isValidEmail) {
      setEmailCheckStatus("invalid");
      setEmailCheckMessage("올바른 이메일 형식이 아닙니다.");
      return;
    }

    const controller = new AbortController();
    const timer = setTimeout(async () => {
      setEmailCheckStatus("checking");
      setEmailCheckMessage("이메일 확인 중...");

      try {
        const response = await fetch(
          `/api/auth/check-email?email=${encodeURIComponent(normalizedEmail)}`,
          { signal: controller.signal }
        );
        const data = (await response.json()) as {
          available?: boolean;
          message?: string;
        };

        if (!response.ok) {
          setEmailCheckStatus("error");
          setEmailCheckMessage(data.message ?? "이메일 확인 중 오류가 발생했습니다.");
          return;
        }

        setEmailCheckStatus(data.available ? "available" : "taken");
        setEmailCheckMessage(
          data.message ??
            (data.available ? "사용 가능한 이메일입니다." : "이미 사용 중인 이메일입니다.")
        );
      } catch (error) {
        if (error instanceof DOMException && error.name === "AbortError") {
          return;
        }

        setEmailCheckStatus("error");
        setEmailCheckMessage("이메일 확인 중 오류가 발생했습니다.");
      }
    }, 350);

    return () => {
      controller.abort();
      clearTimeout(timer);
    };
  }, [normalizedEmail]);

  const showEmailHelper =
    normalizedEmail.length > 0 && (!state?.errors?.email || normalizedEmail !== state.errors.email[0]);

  const emailHelperClassName =
    emailCheckStatus === "available"
      ? "text-green-600"
      : emailCheckStatus === "taken" || emailCheckStatus === "invalid" || emailCheckStatus === "error"
        ? "text-accent"
        : "text-muted";

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-200px)]">
      <div className="w-full max-w-md px-6">
        <div className="text-center mb-8">
          <h1 className="font-serif text-3xl font-bold tracking-tight mb-2">
            회원가입
          </h1>
          <p className="text-sm text-muted">
            패션 AI 커뮤니티에 참여하세요.
          </p>
        </div>

        {state?.success ? (
          <div className="text-center py-8">
            <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
            <p className="font-semibold mb-2">{state.message}</p>
            <p className="text-sm text-muted">로그인 페이지로 이동합니다...</p>
          </div>
        ) : (
          <form action={action} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium mb-2">
                이름
              </label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted" />
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  placeholder="이름을 입력하세요"
                  className="w-full rounded-xl border border-border bg-card pl-11 pr-4 py-3 text-sm outline-none focus:border-accent transition-colors placeholder:text-muted"
                />
              </div>
              {state?.errors?.name && (
                <p className="mt-1 text-xs text-accent">{state.errors.name[0]}</p>
              )}
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-2">
                이메일
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted" />
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="you@example.com"
                  className="w-full rounded-xl border border-border bg-card pl-11 pr-4 py-3 text-sm outline-none focus:border-accent transition-colors placeholder:text-muted"
                />
              </div>
              {state?.errors?.email && (
                <p className="mt-1 text-xs text-accent">{state.errors.email[0]}</p>
              )}
              {!state?.errors?.email && showEmailHelper && (
                <p className={`mt-1 text-xs ${emailHelperClassName}`}>{emailCheckMessage}</p>
              )}
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium mb-2">
                비밀번호
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted" />
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  minLength={8}
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="8자 이상 (영문+숫자 포함)"
                  className="w-full rounded-xl border border-border bg-card pl-11 pr-4 py-3 text-sm outline-none focus:border-accent transition-colors placeholder:text-muted"
                />
              </div>
              <PasswordRequirementList password={password} />
              {state?.errors?.password && (
                <ul className="mt-1 text-xs text-accent space-y-0.5">
                  {state.errors.password.map((err) => (
                    <li key={err}>{err}</li>
                  ))}
                </ul>
              )}
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium mb-2">
                비밀번호 확인
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted" />
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  required
                  placeholder="비밀번호를 다시 입력하세요"
                  className="w-full rounded-xl border border-border bg-card pl-11 pr-4 py-3 text-sm outline-none focus:border-accent transition-colors placeholder:text-muted"
                />
              </div>
              {state?.errors?.confirmPassword && (
                <p className="mt-1 text-xs text-accent">{state.errors.confirmPassword[0]}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={pending || emailCheckStatus === "checking" || emailCheckStatus === "taken"}
              className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-foreground px-6 py-3 text-sm font-semibold text-background hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              {pending ? "가입 중..." : "가입하기"}
              <ArrowRight className="h-4 w-4" />
            </button>
          </form>
        )}

        <p className="mt-6 text-center text-sm text-muted">
          이미 계정이 있으신가요?{" "}
          <Link
            href="/login"
            className="font-medium text-accent hover:underline"
          >
            로그인
          </Link>
        </p>
      </div>
    </div>
  );
}
