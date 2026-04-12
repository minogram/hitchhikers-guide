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

## 로컬 개발

```bash
git clone https://github.com/minogram/hitchhikers-guide.git
cd hitchhikers-guide
npm install
cp .env.local.example .env.local   # 환경변수 편집
npx prisma db push
npx prisma db seed
npm run dev                         # http://localhost:3000
```

### 환경변수 (`.env.local`)

```env
DATABASE_URL=libsql://your-db.turso.io
DATABASE_AUTH_TOKEN=your-turso-auth-token
AUTH_SECRET=          # openssl rand -base64 32
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
ENCRYPTION_SECRET=    # openssl rand -base64 32
```

### Seed 계정

| 역할 | 이메일 | 비밀번호 |
|---|---|---|
| Admin | admin@falab.kr | pass.admin |
| Manager | manager1@falab.kr | pass.manager1 |
| User | user1@falab.kr | pass.user1 |

### NPM Scripts

```bash
npm run dev          # 개발 서버
npm run build        # 프로덕션 빌드
npm run lint         # ESLint
npm run db:migrate   # Prisma 마이그레이션
npm run db:seed      # 초기 데이터 시딩
npm run db:reset     # DB 초기화
```

---

## Vercel 배포

1. GitHub repo 연결 → 자동 배포
2. **Settings → Environment Variables**에 위 환경변수 등록
3. Turso DB 생성:
   ```bash
   turso db create hitchhikers-guide
   turso db show hitchhikers-guide --url
   turso db tokens create hitchhikers-guide
   ```

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
