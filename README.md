# Hitchhiker's Guide to Fashion AI

패션 산업에 특화된 AI 도구 카탈로그 & 커뮤니티 플랫폼

**Live:** https://hitchhikers-guide-black.vercel.app

---

## 기술 스택

| 분류 | 기술 |
|---|---|
| Framework | Next.js 16 (App Router), React 19, TypeScript |
| DB | Turso (libSQL) + Prisma 7 |
| Auth | NextAuth v5 (Credentials, bcrypt, JWT) |
| Image | Cloudinary (upload + CDN) |
| Style | Tailwind CSS 4, Lucide Icons |
| Deploy | Vercel |

---

## 주요 기능

| 페이지 | 설명 |
|---|---|
| `/` | Hero, 공지사항, 인기/신규 앱, 특징 소개 |
| `/catalog` | AI 앱 목록 — Industry/Process 태그 필터, 검색, 좋아요 |
| `/catalog/[id]` | 앱 상세 — 설명, 바로가기, Gemini 데모 영역 |
| `/community` | 게시판 — 공지·아티클·포럼·구인구직, 댓글 |
| `/admin` | 대시보드 — 앱·게시글·사용자·태그 관리 |
| `/mypage` | 프로필, 비밀번호 변경, API 키 관리, 탈퇴 |
| `/about` | AI Literacy Lab 소개 |

### 권한 체계

| 역할 | 권한 |
|---|---|
| Admin | 모든 기능 + 사용자 역할 관리 |
| Manager | 앱 CRUD, 공지·아티클 관리 |
| User | 포럼·구인 작성, 댓글, 좋아요 |

---

## 데이터 모델

`User` · `AppCard` · `Post` · `Comment` · `TagOption` · `AppLike`

- 태그: **Industry** (Fashion, Bags, Shoes, Beauty 등) / **Process** (Design, Manufacturing, Commerce 등)
- 앱 카드의 `tags` 필드에 JSON 배열 저장, `TagOption.type`으로 그룹 판별

---

## Environment

프로젝트 루트에 `.env.local` 파일을 직접 만들고 아래 값을 채워주세요.

### 환경변수 예시

```env
DATABASE_URL=libsql://your-db.turso.io
DATABASE_AUTH_TOKEN=your-turso-auth-token
AUTH_SECRET=your-auth-secret
CLOUDINARY_CLOUD_NAME=your-cloudinary-cloud-name
CLOUDINARY_API_KEY=your-cloudinary-api-key
CLOUDINARY_API_SECRET=your-cloudinary-api-secret
ENCRYPTION_SECRET=your-encryption-secret
```

### 메모

- `AUTH_SECRET`, `ENCRYPTION_SECRET`은 `openssl rand -base64 32`로 생성하는 것을 권장합니다.
- Turso 대신 로컬 SQLite를 사용할 경우 `DATABASE_URL=file:./dev.db` 형태로 지정할 수 있습니다.
- 이미지 업로드 기능을 쓰려면 Cloudinary 환경변수가 필요합니다.

---

## Local Run

### 1. 의존성 설치

```bash
git clone https://github.com/minogram/hitchhikers-guide.git
cd hitchhikers-guide
npm install
```

### 2. 데이터베이스 준비

```bash
npm run db:migrate
npm run db:seed
```

### 3. 개발 서버 실행

```bash
npm run dev
```

브라우저에서 `http://localhost:3000`으로 접속하면 됩니다.

### 자주 쓰는 로컬 명령

```bash
npm run dev
npm run restart
npm run lint
npm run db:migrate
npm run db:seed
npm run db:reset
```

### Seed 계정

| 역할 | 이메일 | 비밀번호 |
|---|---|---|
| Admin | admin@falab.kr | pass.admin |
| Manager | manager1@falab.kr | pass.manager1 |
| User | user1@falab.kr | pass.user1 |

---

## Build

프로덕션 빌드는 아래 명령으로 수행합니다.

```bash
npm run build
```

현재 `build` 스크립트는 아래 순서로 실행됩니다.

```bash
prisma generate && next build
```

로컬에서 프로덕션 모드까지 확인하려면 아래 순서로 실행하면 됩니다.

```bash
npm run build
npm run start
```

기본 실행 주소는 `http://localhost:3000`입니다.

---

## Deploy

현재 README 기준 권장 배포 대상은 Vercel입니다.

### Vercel 배포 순서

1. GitHub repo 연결 → 자동 배포
2. Vercel Project Settings → Environment Variables에 `.env.local`과 동일한 값을 등록
3. 프로덕션 DB로 Turso를 사용할 경우 데이터베이스와 토큰을 생성
   ```bash
   turso db create hitchhikers-guide
   turso db show hitchhikers-guide --url
   turso db tokens create hitchhikers-guide
   ```
4. `DATABASE_URL`, `DATABASE_AUTH_TOKEN`, `AUTH_SECRET`, `CLOUDINARY_*`, `ENCRYPTION_SECRET` 값을 Vercel에 반영
5. 배포 후 `/login`, `/catalog`, `/admin` 등 주요 화면과 이미지 업로드를 점검

### 배포 체크포인트

- 프로덕션에서는 SQLite 파일 대신 Turso 사용을 권장합니다.
- Cloudinary 환경변수가 없으면 업로드 API가 실패합니다.
- 인증이 정상 동작하려면 `AUTH_SECRET`이 배포 환경에도 반드시 동일하게 설정되어야 합니다.

---

## 도메인 관리

gabia.com 386com : ***1@@tls

---

## 앱 JSON Import 형식

관리자 → 앱 목록 → **JSON Import**로 일괄 등록:

```json
[
  {
    "title": "앱 이름",
    "short_description": "한 줄 설명",
    "description": "상세 설명",
    "url": "https://example.com",
    "tags": ["Fashion", "Design"]
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
