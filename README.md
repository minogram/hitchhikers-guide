# Hitchhiker's Guide to Fashion AI

패션 산업에 특화된 AI 도구 카탈로그 & 커뮤니티 플랫폼

**Production:** https://falab.kr

**Vercel Alias:** https://hitchhikers-guide-black.vercel.app

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

## Services

이 프로젝트에서 현재 사용 중인 외부 서비스와 주요 인프라는 아래와 같습니다.

| 구분 | 서비스 | 용도 |
|---|---|---|
| Hosting | Vercel | Next.js 앱 배포, Production/Preview URL 제공 |
| Domain | falab.kr, www.falab.kr | 실제 서비스 도메인 |
| Domain Registrar / DNS | Gabia | 도메인 등록 및 네임서버 관리 |
| Database | Turso (libSQL) | 프로덕션 데이터베이스 |
| ORM | Prisma | DB 스키마, 마이그레이션, 쿼리 |
| Auth | NextAuth v5 + bcrypt | 로그인, 세션, 비밀번호 검증 |
| Image CDN / Upload | Cloudinary | 앱 썸네일 업로드 및 이미지 호스팅 |
| Runtime | Node.js 20.x on Vercel | 서버 실행 환경 |

### 코드 기준 사용 라이브러리

- Next.js 16 App Router
- React 19
- TypeScript 5
- Zod
- TipTap
- sanitize-html
- Lucide React
- Tailwind CSS 4

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

### 현재 배포 상태

- 프로덕션 도메인: `https://falab.kr`
- 추가 도메인: `https://www.falab.kr`
- Vercel 기본 별칭: `https://hitchhikers-guide-black.vercel.app`
- 프로젝트명: `hitchhikers-guide`
- 프로젝트 ID: `prj_9Wp4X1TfJWBbESh9TDScxrfQ1zCU`
- 소유 조직: `minogram's projects`

위 정보는 2026-05-04 기준 아래 명령으로 확인했습니다.

```bash
npm_config_yes=true npx vercel project inspect hitchhikers-guide
npm_config_yes=true npx vercel inspect hitchhikers-guide-black.vercel.app
npm_config_yes=true npx vercel domains inspect falab.kr
```

확인 결과:

- Framework Preset: `Next.js`
- Root Directory: `.`
- Node.js Version: `20.x`
- Build Command: `npm run build` 또는 `next build`
- Production Deployment Alias에 `falab.kr`, `www.falab.kr`, `hitchhikers-guide-black.vercel.app`가 연결되어 있음
- `hitchhikers-guide-git-main-minograms-projects.vercel.app` 별칭이 존재해 Git 연동 기반 배포가 구성된 상태로 보임

### 자동 배포

현재 Vercel 프로젝트는 Git 연동 기반 배포 형태로 연결되어 있습니다. CLI에서 확인한 배포 별칭에 `git-main` URL이 포함되어 있으므로, `main` 브랜치 기준 자동 배포가 동작하는 구성으로 판단할 수 있습니다.

다만 Production Branch 변경 여부까지 README만으로 강제할 수는 없으므로, 최종 확인은 Vercel Dashboard의 Project Settings에서 함께 확인하는 것을 권장합니다.

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

### 커스텀 도메인 메모

- `falab.kr` 도메인은 Vercel 프로젝트 `hitchhikers-guide`에 연결되어 있습니다.
- `www.falab.kr`도 같은 프로젝트에 연결되어 있습니다.
- Vercel CLI 확인 기준 Registrar는 Third Party이며, 현재 네임서버는 Vercel 네임서버가 아니라 Gabia 네임서버를 사용하고 있습니다.
- 즉, 도메인 등록/네임서버 관리는 Gabia 쪽에 있고, 서비스 라우팅은 Vercel 프로젝트에 연결된 상태입니다.

### 배포 체크포인트

- 프로덕션에서는 SQLite 파일 대신 Turso 사용을 권장합니다.
- Cloudinary 환경변수가 없으면 업로드 API가 실패합니다.
- 인증이 정상 동작하려면 `AUTH_SECRET`이 배포 환경에도 반드시 동일하게 설정되어야 합니다.

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
