## ✅ TODO.md (Task List)

### Phase 1: 기초 인프라 구축
- [x] 개발 환경 세팅 (Next.js 16, Tailwind CSS, Lucide, TypeScript)
- [x] 타입 정의 및 데이터 모델 설계 (`src/lib/types.ts`)
- [x] 공통 레이아웃 구성 (Header, Footer, 반응형 네비게이션)
- [x] Noto Sans KR / Playfair Display 폰트 및 디자인 시스템 적용
- [x] Database 연결 (Prisma 7 + SQLite + libSQL adapter)
- [x] NextAuth 인증 연동 (회원가입/로그인 백엔드)
- [x] Admin 계정 초기 생성 (시드 스크립트)

### Phase 2: 관리자 및 매니저 기능
- [x] 관리자 대시보드 UI (`/admin`) — 통계, 사용자 목록, 퀵 액션
- [x] 권한 관리 시스템 (RBAC) 백엔드 구현
- [x] 매니저 임명/해임 기능 연동
- [x] 앱 카탈로그 CRUD (등록/수정/삭제) 백엔드 연동

### Phase 3: 프론트엔드 및 카탈로그
- [x] **Hero Section:** 대형 Serif 타이포그래피 + CTA 버튼 구성
- [x] **App Catalog:** Industry/Process 별 필터링 + 검색 UI (`/catalog`)
- [x] **App Detail Page:** 설명글, 바로가기 링크, Gemini 데모 영역 (`/catalog/[id]`)
- [x] 앱 카드 UI (태그, 호버 효과, Gemini 뱃지)
- [x] 카탈로그 데이터 DB 연동 (현재 샘플 데이터)

### Phase 4: 커뮤니티 및 아티클
- [x] 게시판 목록 UI (공지사항, 포럼, 구인구직, 아티클 탭) (`/community`)
- [x] 게시글 상세 페이지 + 댓글 영역 UI (`/community/[id]`)
- [x] 로그인/회원가입 페이지 UI (`/login`, `/register`)
- [x] 게시판 CRUD 백엔드 연동
- [x] 에디터 라이브러리 연동 (아티클 작성용)
- [x] 댓글 기능 백엔드 연동

### Phase 5: 마이페이지

- [x] 사용자의 설정을 위한 마이페이지 
- [x] 비번 번경, 사용자 이메일 변경, 개인용 Gemini API Key 저장
- [x] API Key 등은 보안에 민감한 부분이므로 보안 검토 필요
- [x] Gemini 등 키가 필요한 기능은 개인 API Key 를 사용함
- [x] 탈퇴 기능
- [x] 다크 모드 토글 기능

### Phase 6: 기능 디테일

- [x] 앱 카달로그 관리에서 키워드로 검색 가능하게
- [x] 사용자 관리에서 키워드로 검색 가능하게
- [x] 아티클 관리 기능 세부 구현
- [x] 바로가기 앱 편집 

### Phase 7: 검토 및 개선

#### 7-1. 🔴 보안 (Critical)

- [ ] **암호화 시크릿 하드코딩 제거** — `src/lib/crypto.ts`에서 `ENCRYPTION_SECRET` 환경변수 미설정 시 하드코딩된 기본값 사용. 프로덕션에서 반드시 에러를 던지도록 수정
- [x] **서버 액션 에러 핸들링** — `src/app/actions/` 전체 파일에서 DB 작업에 try-catch 없음. DB 오류 시 앱 크래시 발생
- [x] **toggleLike throw 대신 return** — `src/app/actions/likes.ts`에서 `throw new Error`로 처리 중. `return { error }` 패턴으로 통일
- [ ] **ID 입력값 검증** — 서버 액션에서 받는 ID 파라미터에 Zod 등으로 CUID 검증 없음 (comments, posts, admin, apps)
- [ ] **bulk 작업 입력 제한** — `bulkSetAppVisibility`에 배열 크기 제한 없음. DoS 위험
- [ ] **XSS 방어 점검** — 게시글/댓글 저장 시 HTML 콘텐츠 미살균. SafeHtml 컴포넌트의 살균 수준 검토 필요
- [ ] **보안 응답 헤더 추가** — Next.js middleware에서 `X-Content-Type-Options`, `X-Frame-Options`, CSP 등 헤더 설정

#### 7-2. 🟠 버그 및 안정성

- [x] **not-found.tsx 생성** — 커스텀 404 페이지 없음. 사이트 디자인에 맞는 Not Found 페이지 필요
- [x] **댓글 작성 시 게시글 존재 확인** — `createComment()`에서 해당 게시글의 존재 여부를 확인하지 않음
- [x] **좋아요 토글 시 앱 존재 확인** — `toggleLike()`에서 해당 앱의 존재 여부를 확인하지 않음
- [x] **이메일 중복 검사 레이스 컨디션** — `auth.ts` 회원가입에서 중복 체크와 생성 사이에 타이밍 이슈 가능. DB 유니크 제약조건 에러 핸들링 필요
- [ ] **Cloudinary 삭제 실패 무시** — 앱 수정/삭제 시 Cloudinary 이미지 삭제 실패가 완전히 무시됨. 최소 로깅 필요
- [ ] **태그 업데이트 부분 실패** — `tags.ts`에서 여러 앱의 태그를 업데이트할 때 트랜잭션 없이 진행. 부분 실패 가능

#### 7-3. 🟡 SEO 및 메타데이터

- [x] **동적 메타데이터 추가** — 카탈로그 상세(`catalog/[id]`), 게시글 상세(`community/[id]`) 등에 `generateMetadata()` 없음
- [x] **Open Graph 태그 추가** — SNS 공유 시 제목/이미지/설명이 제대로 표시되지 않음
- [x] **관리자 페이지 noindex** — `/admin` 경로에 `robots: { index: false }` 메타데이터 추가

#### 7-4. 🔵 접근성 (Accessibility)

- [x] **Header 활성 링크 표시** — 현재 페이지에 해당하는 네비게이션 링크에 활성 상태 스타일이 없음
- [x] **모바일 메뉴 aria-expanded** — Header 모바일 메뉴 버튼에 `aria-expanded` 속성 누락
- [x] **에디터 툴바 aria-label** — `EditorToolbar.tsx`의 모든 버튼에 `aria-label` 없음 (`title`만 있음)
- [x] **스킵 네비게이션 링크** — 메인 콘텐츠로 바로 이동하는 스킵 링크 없음
- [x] **검색 입력 label 연결** — 커뮤니티 검색 input에 id/label 연결 없음

#### 7-5. 🎨 디자인 일관성

- [ ] **버튼 스타일 통일** — 사이트 전반에서 `rounded-full`/`rounded-xl`/`rounded-lg`, 패딩(`py-2`/`py-2.5`/`py-3`) 등이 혼재. 버튼 컴포넌트 시스템 도입 검토
- [ ] **섹션 간격 통일** — 홈페이지 내에서도 `py-12`, `py-20` 등 섹션 패딩이 불일치
- [x] **confirm() 다이얼로그 개선** — 삭제/탈퇴 시 브라우저 기본 `confirm()` 사용 중. 커스텀 모달로 교체

#### 7-6. ⚡ 성능

- [x] **RichTextEditor 동적 임포트** — TipTap 에디터가 번들에 포함됨. `dynamic()` 으로 지연 로딩 적용
- [x] **카탈로그 이미지 sizes 속성** — `catalog/page.tsx`에서 이미지의 `sizes` 속성 누락. 반응형 이미지 최적화 필요
- [x] **로딩 스켈레톤 UI** — 커뮤니티 목록, 홈페이지 앱 섹션 등에 스켈레톤 UI 대신 텍스트만 표시

#### 7-7. 🧭 UX 개선

- [ ] **비밀번호 강도 표시기** — 회원가입/비밀번호 변경에서 비밀번호 요구사항 충족 여부 실시간 피드백 없음
- [ ] **이메일 실시간 중복 체크** — 회원가입에서 제출 후에만 중복 확인 가능
- [x] **뒤로가기 필터 유지** — 카탈로그 상세에서 뒤로 갈 때 필터/스크롤 위치 손실
- [x] **관리자 테이블 모바일 대응** — 관리자 페이지 테이블이 좁은 화면에서 잘림. `overflow-x-auto` 적용 필요
- [x] **에디터 이미지 업로드 실패 시 alert 개선** — `RichTextEditor`에서 기본 `alert()` 사용 중. 인라인 에러 메시지로 교체

### 나중에 할일들: 이 항목을 구현하지 마세요

- [ ] falab.kr 도메인 등록 
- [ ] Gemini API 실제 연동 (프록시 API Route)
- [ ] Gemini를 활용한 패션 추천 기능 정교화
- [x] Vercel 또는 AWS를 통한 배포
