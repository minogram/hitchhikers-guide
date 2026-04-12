'use client';

import { useEffect } from 'react';

export default function Error({
  error,
  unstable_retry,
}: {
  error: Error & { digest?: string };
  unstable_retry: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="mx-auto max-w-xl px-6 py-24 text-center">
      <h2 className="font-serif text-2xl font-bold tracking-tight mb-4">
        문제가 발생했습니다
      </h2>
      <p className="text-muted mb-8">
        페이지를 불러오는 중 오류가 발생했습니다. 다시 시도해 주세요.
      </p>
      <button
        onClick={() => unstable_retry()}
        className="rounded-full bg-accent px-6 py-2.5 text-sm font-medium text-white hover:bg-accent/90 transition-colors"
      >
        다시 시도
      </button>
    </div>
  );
}
