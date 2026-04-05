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
- [ ] 권한 관리 시스템 (RBAC) 백엔드 구현
- [ ] 매니저 임명/해임 기능 연동
- [ ] 앱 카탈로그 CRUD (등록/수정/삭제) 백엔드 연동

### Phase 3: 프론트엔드 및 카탈로그
- [x] **Hero Section:** 대형 Serif 타이포그래피 + CTA 버튼 구성
- [x] **App Catalog:** Industry/Process 별 필터링 + 검색 UI (`/catalog`)
- [x] **App Detail Page:** 설명글, 바로가기 링크, Gemini 데모 영역 (`/catalog/[id]`)
- [x] 앱 카드 UI (태그, 호버 효과, Gemini 뱃지)
- [ ] 카탈로그 데이터 DB 연동 (현재 샘플 데이터)

### Phase 4: 커뮤니티 및 아티클
- [x] 게시판 목록 UI (공지사항, 포럼, 구인구직, 아티클 탭) (`/community`)
- [x] 게시글 상세 페이지 + 댓글 영역 UI (`/community/[id]`)
- [x] 로그인/회원가입 페이지 UI (`/login`, `/register`)
- [ ] 게시판 CRUD 백엔드 연동
- [ ] 에디터 라이브러리 연동 (아티클 작성용)
- [ ] 댓글 기능 백엔드 연동

### Phase 5: 고도화 및 배포
- [ ] Gemini API 실제 연동 (프록시 API Route)
- [ ] Gemini를 활용한 패션 추천 기능 정교화
- [ ] 다크 모드 토글 기능
- [ ] Vercel 또는 AWS를 통한 배포
- [ ] 최종 디자인 검수 (패션 매거진 느낌의 UI 디테일 조정)