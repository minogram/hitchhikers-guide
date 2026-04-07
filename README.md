# Hitchhiker's Guide to Fashion AI

패션 산업에 특화된 AI 도구 카탈로그 & 커뮤니티 플랫폼

## 기술 스택

| 분류 | 기술 |
|---|---|
| 프레임워크 | Next.js 15 (App Router), TypeScript |
| DB | [Turso](https://turso.tech) (libSQL / SQLite 호환) |
| ORM | Prisma v7 + `@prisma/adapter-libsql` |
| 인증 | NextAuth.js v5 (Credentials) |
| 이미지 | Cloudinary (업로드 + CDN) |
| 스타일 | Tailwind CSS |
| 배포 | Vercel |

---

## 주요 기능

### 카탈로그
- AI 앱 목록 (태그 필터, 키워드 검색)
- 좋아요, 더보기 페이지네이션

### 커뮤니티
- 게시글 작성 / 수정 / 삭제
- 댓글, 핀 공지, 카테고리

### 관리자 (admin / manager)
- 앱 등록 · 수정 · 삭제 · 노출 on/off
  - 썸네일: 클릭 / 드래그앤드롭 / 클립보드 붙여넣기
  - 태그 선택 및 신규 태그 추가
  - Gemini AI 데모 toggle
  - 카탈로그 노출 toggle
- 게시글 관리 (핀 · 노출 · 삭제)
- 사용자 관리 (역할 변경)
- JSON 파일로 앱 일괄 import

### 마이페이지
- 프로필 수정, 비밀번호 변경
- Gemini API 키 등록 (암호화 저장)
- 회원 탈퇴

---

## 로컬 개발 환경 세팅

### 1. 코드 받기

```bash
git clone https://github.com/minogram/hitchhikers-guide.git
cd hitchhikers-guide
```

### 2. 패키지 설치

```bash
npm install
```

### 3. 환경 변수 설정

`.env.local.example`을 복사하여 `.env.local`을 만들고 값을 채워넣으세요:

```bash
cp .env.local.example .env.local
```

```env
# Turso DB (로컬 개발 시 Turso URL 또는 file:./dev.db 사용 가능)
DATABASE_URL=libsql://your-db.turso.io
DATABASE_AUTH_TOKEN=your-turso-auth-token

# NextAuth v5
AUTH_SECRET=랜덤32자  # openssl rand -base64 32

# Cloudinary (이미지 업로드)
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# Gemini API 키 암호화용
ENCRYPTION_SECRET=랜덤32자  # openssl rand -base64 32
```

> 로컬에서만 빠르게 테스트하려면 `DATABASE_URL=file:./dev.db` 로 설정하고 `prisma.config.ts`의 `datasource.url`도 같이 변경하세요.

### 4. DB 스키마 적용

```bash
npx prisma db push
```

### 5. 초기 데이터 입력

```bash
npx prisma db seed
```

seed 후 생성되는 계정:

| 역할 | 이메일 | 비밀번호 |
|------|--------|----------|
| Admin | admin@falab.kr | pass.admin |
| Manager | manager1@falab.kr | pass.manager1 |
| User | user1@falab.kr | pass.user1 |

### 6. 개발 서버 실행

```bash
npm run dev
```

[http://localhost:3000](http://localhost:3000) 에서 확인

---

## Vercel 배포

### 필요한 외부 서비스

| 서비스 | 용도 | 무료 플랜 |
|---|---|---|
| [Turso](https://turso.tech) | DB (libSQL) | 500MB, 3DB |
| [Cloudinary](https://cloudinary.com) | 이미지 업로드 / CDN | 25GB |
| [Vercel](https://vercel.com) | 호스팅 | Hobby 플랜 |

### Turso DB 생성

```bash
# Turso CLI 설치
curl -sSfL https://get.tur.so/install.sh | bash

# 로그인 (WSL 환경)
turso auth login --headless

# DB 생성
turso db create hitchhikers-guide

# URL과 토큰 확인
turso db show hitchhikers-guide --url
turso db tokens create hitchhikers-guide
```

### 스키마 및 데이터 이전

```bash
# 로컬 dev.db → Turso로 데이터 이전
sqlite3 dev.db .dump > /tmp/dump.sql
turso db shell hitchhikers-guide < /tmp/dump.sql
```

### Vercel 환경변수

Vercel 대시보드 → 프로젝트 → **Settings → Environment Variables**에서 아래 변수 등록:

| 키 | 설명 |
|---|---|
| `DATABASE_URL` | `libsql://your-db.turso.io` |
| `DATABASE_AUTH_TOKEN` | Turso 인증 토큰 |
| `AUTH_SECRET` | `openssl rand -base64 32` |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary 클라우드명 |
| `CLOUDINARY_API_KEY` | Cloudinary API 키 |
| `CLOUDINARY_API_SECRET` | Cloudinary API Secret |
| `ENCRYPTION_SECRET` | `openssl rand -base64 32` |

### 배포

GitHub에 push하면 자동 배포됩니다.

---

## 앱 JSON 일괄 import 형식

관리자 페이지 → 앱 목록 → **JSON Import** 버튼으로 앱을 일괄 등록할 수 있습니다.

```json
[
  {
    "title": "앱 이름",
    "short_description": "한 줄 설명",
    "description": "상세 설명",
    "url": "https://example.com",
    "tags": ["태그1", "태그2"]
  }
]
```

> `tags` 필드 외에 `industry`, `process` 배열도 지원합니다 (자동 병합).

---

## 주의사항

- `dev.db` 파일은 `.gitignore`에 포함되어 git에 올라가지 않습니다.
- 프로덕션에서는 반드시 Turso를 사용하세요. Vercel은 파일시스템이 임시 메모리라 SQLite 파일이 배포마다 초기화됩니다.
- `AUTH_SECRET`과 `ENCRYPTION_SECRET`은 유출되면 세션과 암호화된 API 키가 모두 노출됩니다.

---

## 참고 문서

- [Next.js Documentation](https://nextjs.org/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
- [Turso Documentation](https://docs.turso.tech)
- [NextAuth.js v5](https://authjs.dev)
- [Cloudinary Docs](https://cloudinary.com/documentation)
