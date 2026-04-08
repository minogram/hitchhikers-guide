# Hitchhiker's Guide to Fashion AI

패션 산업에 특화된 AI 도구 카탈로그 & 커뮤니티 플랫폼 — **AI Literacy Lab**

---

## 기술 스택

| 분류 | 기술 | 버전 |
|---|---|---|
| 프레임워크 | Next.js (App Router) | 16.2.2 |
| 언어 | TypeScript | 5.x |
| UI 라이브러리 | React | 19.2.4 |
| DB | [Turso](https://turso.tech) (libSQL / SQLite 호환) | — |
| ORM | Prisma + `@prisma/adapter-libsql` | 7.6.0 |
| 인증 | NextAuth.js v5 (Credentials) | 5.0.0-beta.30 |
| 유효성 검증 | Zod | 4.x |
| 이미지 | Cloudinary (업로드 + CDN) | — |
| 아이콘 | Lucide React | 1.7.x |
| 스타일 | Tailwind CSS | 4.x |
| 배포 | Vercel | — |

---

## 프로젝트 구조

```
├── prisma/
│   ├── schema.prisma          # DB 스키마 (User, AppCard, Post, Comment, TagOption, AppLike)
│   ├── seed.ts                # 초기 데이터 시딩
│   └── migrations/            # Prisma 마이그레이션 파일
├── public/uploads/            # 로컬 업로드 폴더
├── data/                      # JSON import 샘플 데이터
├── docs/                      # PRD, TRD 등 기획 문서
├── scripts/                   # 유틸리티 스크립트 (태그 마이그레이션 등)
└── src/
    ├── app/
    │   ├── layout.tsx         # 루트 레이아웃 (ThemeProvider, Header, Footer)
    │   ├── page.tsx           # 랜딩 페이지 (Hero, Notice, Popular/New Apps, Features)
    │   ├── globals.css        # Tailwind + 커스텀 CSS 변수 (다크 테마)
    │   ├── actions/           # Server Actions (앱, 게시글, 인증, 태그, 좋아요 등)
    │   ├── api/               # Route Handlers (REST API)
    │   ├── catalog/           # AI 앱 카탈로그 (목록 + 상세)
    │   ├── community/         # 커뮤니티 게시판 (CRUD + 댓글)
    │   ├── admin/             # 관리자 대시보드 (앱, 게시글, 사용자 관리)
    │   ├── about/             # About 페이지 (미션, 연구자, 커리큘럼)
    │   ├── mypage/            # 마이페이지 (프로필, 비밀번호, 탈퇴)
    │   ├── login/             # 로그인
    │   └── register/          # 회원가입
    ├── components/
    │   ├── layout/            # Header, Footer
    │   ├── LikeButton.tsx     # 좋아요 버튼 컴포넌트
    │   ├── Providers.tsx      # NextAuth SessionProvider
    │   └── ThemeProvider.tsx   # 다크 테마 provider
    ├── lib/
    │   ├── auth.ts            # NextAuth 설정 (Credentials)
    │   ├── prisma.ts          # Prisma 클라이언트 (LibSQL 어댑터)
    │   ├── crypto.ts          # AES 암호화/복호화
    │   ├── auth-guard.ts      # 역할 기반 접근 제어
    │   └── definitions.ts     # Zod 스키마 (폼 유효성 검증)
    └── types/
        └── next-auth.d.ts     # NextAuth 타입 확장
```

---

## 주요 기능

### 랜딩 페이지 (`/`)
- Hero 섹션 — 서비스 소개 + CTA 버튼
- 공지사항 — 최신 공지 미리보기
- 인기 앱 / 최신 앱 — 카탈로그 하이라이트
- 특징 소개 — 플랫폼 핵심 가치 안내

### AI 앱 카탈로그 (`/catalog`)
- 앱 카드 목록 (썸네일, 이름, 설명, 태그)
- **태그 그룹 필터** — Industry / Process 2행 멀티 셀렉트
  - 그룹 내: OR 필터 / 그룹 간: AND 필터
- 키워드 검색 + 좋아요 + 더보기 페이지네이션
- 상세 페이지 — 상세 설명 + 바로가기 링크

### 커뮤니티 (`/community`)
- 게시글 타입: **공지(Notice)**, **아티클(Article)**, **포럼(Forum)**, **구인구직(Job)**
- 역할 기반 권한:
  - 공지 / 아티클: Admin · Manager만 작성 · 수정 · 삭제
  - 포럼 / 구인구직: 본인 작성글 수정 · 삭제 (Admin · Manager는 타인 글도 관리 가능)
- 댓글, 핀 공지, 카테고리 탭

### 관리자 (`/admin`) — Admin · Manager 전용
- **대시보드** — 노출 중인 앱 수, 게시글 수, 사용자 수 요약
- **앱 관리**
  - 등록 · 수정 · 삭제
  - 썸네일: 클릭 업로드 / 드래그앤드롭 / 클립보드 붙여넣기
  - 태그: Industry · Process 그룹별 체크박스 선택 + 그룹별 새 태그 추가
  - Gemini AI 데모 toggle · 카탈로그 노출 toggle
  - **일괄 선택 + 노출 On/Off** (체크박스 → 플로팅 액션바)
  - JSON 파일로 앱 일괄 import
- **게시글 관리** — 핀 · 노출 · 삭제
- **사용자 관리** — 역할 변경 (Admin / Manager / User)

### About 페이지 (`/about`)
- AI Literacy Lab 미션 소개
- 연구자 소개 (신용남 박사)
- 교육 커리큘럼 (4개 모듈)

### 마이페이지 (`/mypage`)
- 프로필 수정 (이름, 프로필 이미지)
- 비밀번호 변경
- 회원 탈퇴

### 인증 시스템
- 이메일 / 비밀번호 기반 Credentials 인증
- 역할: Admin → Manager → User (3단계)
- bcrypt 비밀번호 해싱, AES API 키 암호화

---

## 데이터 모델

| 모델 | 설명 |
|---|---|
| `User` | 사용자 (email, name, password, role, geminiApiKey) |
| `AppCard` | AI 앱 카드 (title, description, tags, thumbnail, isVisible, likeCount) |
| `Post` | 게시글 (type: notice/forum/job/article, isPinned, isVisible) |
| `Comment` | 댓글 (Post에 종속, Cascade 삭제) |
| `TagOption` | 태그 옵션 (type: industry/process, label) |
| `AppLike` | 앱 좋아요 (User-AppCard 복합키) |

### 태그 시스템

태그는 **Industry**와 **Process** 두 그룹으로 구분됩니다:

- **Industry:** Fashion, Bags, Shoes, Beauty, Socks, Packaging, Korean, Texture, Material, Dancheong 등
- **Process:** Season Planning, Design, Manufacturing, Commerce, Branding, VMD, Lookbook, Video, Location, Marketing 등

앱 카드의 `tags` 필드에 JSON 배열로 저장되며, `TagOption` 테이블의 `type`으로 그룹을 판별합니다.

---

## 퍼블리싱

### 디자인 컨셉
- **"High-Tech Fashion Magazine"** — 미니멀리즘 + 강렬한 타이포그래피
- **다크 테마** 기반 UI (CSS 변수로 테마 토큰 관리)

### 스타일 시스템
- Tailwind CSS 4 + CSS 변수 기반 디자인 토큰
- 주요 토큰: `--color-bg`, `--color-card`, `--color-accent`, `--color-border`, `--color-muted` 등
- 폰트: Noto Sans KR (본문), Serif 계열 (제목)
- 아이콘: Lucide React

### 페이지 레이아웃
- **Header**: 로고 + 네비게이션 (AI APPS, COMMUNITY, ABOUT) + 사용자 메뉴
- **Footer**: 사이트 정보 + 링크
- 반응형 디자인 (모바일 → 데스크톱)

### 이미지 처리
- Cloudinary CDN을 통한 이미지 업로드 · 서빙
- Next.js `<Image>` 컴포넌트로 자동 최적화
- 앱 썸네일: 드래그앤드롭 + 클립보드 붙여넣기 지원

---

## 개발 방법

### AI 에이전트 기반 개발

이 프로젝트는 **GitHub Copilot (Claude) AI 에이전트**와 협업하여 개발되었습니다.

- 기획서(PRD/TRD) 작성 → AI 에이전트에게 구현 지시 → 코드 리뷰 · 수정
- Server Actions + App Router 패턴으로 서버/클라이언트 분리
- `AGENTS.md`, `CLAUDE.md`에 AI 에이전트용 프로젝트 컨텍스트 관리

### 아키텍처 패턴

- **Server Components** — 데이터 페칭은 서버 컴포넌트에서 수행
- **Server Actions** (`src/app/actions/`) — 폼 제출 · 데이터 변경 로직
- **Route Handlers** (`src/app/api/`) — 클라이언트에서 호출하는 REST API
- **클라이언트 컴포넌트** — `"use client"` 선언, 인터랙션 및 상태 관리
- **역할 기반 접근 제어** — `auth-guard.ts`로 서버 액션 수준 권한 검증

### NPM 스크립트

```bash
npm run dev          # 개발 서버 (localhost:3000)
npm run build        # 프로덕션 빌드 (prisma generate + next build)
npm run start        # 프로덕션 서버
npm run restart      # 포트 해제 후 개발 서버 재시작
npm run lint         # ESLint
npm run db:migrate   # Prisma 마이그레이션
npm run db:seed      # 초기 데이터 시딩
npm run db:reset     # DB 초기화 (마이그레이션 리셋)
```

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
# Turso DB
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
