제시해주신 요구사항을 바탕으로, 패션과 기술이 결합된 독창적인 정체성을 담은 **Hitchhiker's Guide to Fashion AI**의 상세 기획서(PRD)입니다.

---

# 📄 Product Requirement Document (PRD)

## 1. 프로젝트 개요 (Project Overview)
* **프로젝트 명:** Hitchhiker's Guide to Fashion AI (HGFAI)
* **목표:** 패션 산업에 특화된 AI 도구들을 큐레이션하고, 전문가들이 소통하며 새로운 기술적 가치를 창출하는 허브 구축.
* **핵심 가치:** 큐레이션(Curating), 연결(Connecting), 창조(Creating).

---

## 2. 사용자 역할 및 권한 (User Roles & Permissions)

| 역할 | 권한 요약 | 비고 |
| :--- | :--- | :--- |
| **관리자 (Admin)** | 전체 시스템 제어, 매니저 임명/해임, 모든 콘텐츠 수정 및 삭제 | `admin@falab.kr` / `pass.admin` |
| **매니저 (Manager)** | 앱 카탈로그 등록/수정, 공지사항 관리, 아티클 작성 | 관리자에 의해 지정됨 |
| **일반 회원 (User)** | 카탈로그 열람, 커뮤니티 게시글 작성/댓글, 구인구직 등록 | 회원가입 필요 |
| **방문자 (Guest)** | 랜딩 페이지 및 카탈로그 열람 (일부 기능 제한) | 비로그인 상태 |

---

## 3. 핵심 기능 요구사항 (Functional Requirements)

### 3.1. 회원 시스템
* **가입/로그인:** 이메일 기반의 가입 프로세스.
* **권한 로직:** * 기본 가입 시 `User` 등급 부여.
    * `Admin`은 사용자 목록에서 특정 사용자를 `Manager` 등급으로 격상 가능.

### 3.2. AI 앱 카탈로그 (Main Feature)
* **속성 정의 (Tags):**
    * **Industry:** Fashion, Bags, Shoes, Beauty 등.
    * **Process:** Planning, Design, Production, Commerce 등.
* **앱 카드 (App Card):** * 구성: 썸네일 이미지, 앱 명칭, 한 줄 요약, 태그(Industry/Process).
    * 인터렉션: 클릭 시 상세 페이지(설명글, 바로가기 링크)로 이동.
* **Gemini API 연동:** * 일부 상세 페이지 내에서 Gemini API를 이용한 실시간 프롬프트 테스트 또는 결과물 생성 기능 제공.

### 3.3. 커뮤니티 및 게시판
* **공지사항 (Notice):** 관리자/매니저만 작성 가능. 상단 고정 기능.
* **포럼 (Forum):** 자유로운 의견 교환 및 Q&A.
* **구인구직 (Job Board):** 패션 테크 분야 채용 공고 및 인재 등록.
* **아티클 (Articles):** 매니저급 이상이 작성하는 심도 있는 AI 패션 트렌드 분석.

### 3.4. 관리 기능
* **콘텐츠 관리:** 카탈로그 내 앱 정보의 실시간 CRUD(생성, 읽기, 수정, 삭제).
* **사용자 관리:** 회원 등급 조정 및 제재.

---

## 4. 디자인 및 UI/UX 요구사항 (Design Specifications)

### 4.1. 시각적 스타일
* **Concept:** "High-Tech Fashion Magazine" (미니멀리즘 + 강렬한 타이포그래피).
* **Font:** **Noto Sans KR** (기본), 영문의 경우 세련된 Serif 혼용 권장.
* **Icons:** **Lucide Icon Set** 사용 (일관된 선 굵기 유지).
* **Layout:** 정형화된 그리드 시스템보다는 시원한 여백과 비대칭 레이아웃을 섞어 패션 감각 강조.

### 4.2. 주요 페이지 구성
* **Hero Section:** * 사이트의 정체성을 보여주는 강렬한 메인 카피와 비주얼(AI 생성 패션 이미지 등).
    * 서비스의 목적을 한눈에 알 수 있는 Call-to-Action 버튼.
* **App Catalog Feed:** * 세련된 필터 인터페이스 (L-Side 또는 상단 Floating 방식).
    * 마우스 호버 시 상세 정보가 부드럽게 노출되는 카드 UI.

---

## 5. 기술적 고려사항 (Technical Notes)

* **Front-end:** Next.js (React)를 사용한 빠른 성능 및 SEO 최적화.
* **Styling:** Tailwind CSS를 활용한 커스텀 디자인 구현.
* **AI Integration:**
    ```javascript
    // Gemini API 연결 예시 (Backend)
    const { GoogleGenerativeAI } = require("@google/generative-ai");
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    ```
* **Security:** 관리자 초기 계정 보안 처리 및 API Key의 서버사이드 은닉.

---

## 6. 마일스톤 (Milestones)
1.  **Week 1:** 브랜드 아이덴티티 확립 및 회원 가입/권한 시스템 구축.
2.  **Week 2:** 앱 카탈로그 데이터 구조 설계 및 관리자 업로드 기능 구현.
3.  **Week 3:** 커뮤니티 게시판 및 포럼 기능 개발.
4.  **Week 4:** Gemini API 연동 및 UI 디테일(애니메이션, 패션 룩) 최적화.

---