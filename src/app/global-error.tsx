'use client';

export default function GlobalError({
  error,
  unstable_retry,
}: {
  error: Error & { digest?: string };
  unstable_retry: () => void;
}) {
  return (
    <html lang="ko">
      <body>
        <div style={{ maxWidth: '32rem', margin: '6rem auto', textAlign: 'center', padding: '0 1.5rem' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem' }}>
            문제가 발생했습니다
          </h2>
          <p style={{ color: '#6b7280', marginBottom: '2rem' }}>
            페이지를 불러오는 중 오류가 발생했습니다. 다시 시도해 주세요.
          </p>
          <button
            onClick={() => unstable_retry()}
            style={{
              backgroundColor: '#6366f1',
              color: '#fff',
              border: 'none',
              borderRadius: '9999px',
              padding: '0.625rem 1.5rem',
              fontSize: '0.875rem',
              fontWeight: 500,
              cursor: 'pointer',
            }}
          >
            다시 시도
          </button>
        </div>
      </body>
    </html>
  );
}
