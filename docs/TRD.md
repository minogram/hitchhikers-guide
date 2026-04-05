패션과 AI의 만남이라니, 이름부터 정말 매력적이네요! **"Hitchhiker's Guide to Fashion AI"**라는 컨셉에 맞춰, 세련되면서도 기술적인 신비로움이 느껴지는 사이트 구축을 위한 문서들을 정리해 드립니다.

---

## 📄 PRD.md (Product Requirement Document)

### 1. 프로젝트 개요
* **서비스명:** Hitchhiker's Guide to Fashion AI (HGFAI)
* **비전:** 패션 산업 종사자들을 위한 AI 도구 카탈로그 및 커뮤니티 허브
* **타겟:** 패션 디자이너, MD, 마케터, AI 개발자, 패션 테크 스타트업

### 2. 사용자 역할 (User Roles)
| 역할 | 권한 내용 |
| :--- | :--- |
| **관리자 (Admin)** | 모든 콘텐츠 관리, 매니저 임명, 시스템 설정 (`admin@hitchhikers.com`) |
| **매니저 (Manager)** | 앱 카탈로그 등록/수정, 아티클 및 공지사항 작성 |
| **사용자 (User)** | 카탈로그 열람, 포럼 참여, 구인구직 게시판 이용 |

### 3. 핵심 기능 (Key Features)
* **AI App 카탈로그:**
    * 산업별(Fashion, Bags, Shoes, Beauty) 및 공정별(Planning, Design, Production, Commerce) 필터링.
    * Gemini API 연동을 통한 실시간 AI 기능 시연 기능.
* **커뮤니티:** 포럼, 구인구직 게시판, 전문 아티클 섹션.
* **회원 관리:** 이메일 기반 가입 및 등급별 권한 제어 (RBAC).

### 4. 디자인 컨셉
* **Font:** Noto Sans KR (가독성과 모던함)
* **Icons:** Lucide React (미니멀하고 깔끔한 선)
* **Style:** 하이엔드 패션 잡지 같은 레이아웃, 과감한 타이포그래피, 다크 모드 지원 고려.

---

## 🛠️ TRD.md (Technical Requirement Document)

### 1. Tech Stack
* **Frontend:** React.js or Next.js (SEO를 위해 Next.js 권장), Tailwind CSS
* **Backend:** Node.js (Express) or Next.js Server Actions
* **Database:** PostgreSQL (Supabase) or MongoDB
* **Authentication:** NextAuth.js or Firebase Auth
* **AI Integration:** Google Generative AI SDK (Gemini Pro/Vision)
* **Icons:** Lucide-react

### 2. 데이터 모델 (Data Schema)
* **User:** `id, email, password, role(admin/manager/user), profile_img`
* **AppCard:** `id, title, thumbnail, description, link, industry_tag, process_tag, created_by`
* **Board/Article:** `id, type(notice/forum/job/article), title, content, author_id`

### 3. Gemini API 연동 설계
* **Proxy API Route:** 클라이언트에서 API 키 노출 방지를 위해 서버 측에서 호출.
* **Context:** 패션 데이터(이미지 분석, 트렌드 텍스트 등)를 Gemini에 전달하여 앱 내에서 즉각적인 결과물 생성 체험.

---

**디자인 팁:**
패션 사이트 느낌을 내려면 여백(White Space)을 과감하게 사용하고, 이미지 썸네일을 정형화된 크기가 아닌 잡지 레이아웃처럼 비대칭적으로 배치해 보세요. 폰트는 $bold$한 무게감을 활용하면 훨씬 세련되어 보일 거예요!

