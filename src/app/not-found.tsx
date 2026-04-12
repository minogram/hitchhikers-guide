import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-xl px-6 py-24 text-center">
      <p className="text-6xl font-bold text-accent mb-4">404</p>
      <h2 className="font-serif text-2xl font-bold tracking-tight mb-4">
        페이지를 찾을 수 없습니다
      </h2>
      <p className="text-muted mb-8">
        요청하신 페이지가 존재하지 않거나 이동되었습니다.
      </p>
      <Link
        href="/"
        className="inline-flex items-center gap-2 rounded-full bg-foreground px-6 py-3 text-sm font-semibold text-background hover:opacity-90 transition-opacity"
      >
        <ArrowLeft className="h-4 w-4" />
        홈으로 돌아가기
      </Link>
    </div>
  );
}
