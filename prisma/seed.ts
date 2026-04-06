import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaLibSql } from "@prisma/adapter-libsql";
import bcrypt from "bcryptjs";

const adapter = new PrismaLibSql({ url: "file:dev.db" });
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("🌱 Seeding database...");

  // Create admin user
  const adminPassword = await bcrypt.hash("pass.admin", 10);
  const admin = await prisma.user.upsert({
    where: { email: "admin@falab.kr" },
    update: {},
    create: {
      email: "admin@falab.kr",
      name: "Admin",
      password: adminPassword,
      role: "admin",
    },
  });
  console.log(`✅ Admin user: ${admin.email}`);

  // Create sample manager
  const managerPassword = await bcrypt.hash("pass.manager1", 10);
  const manager = await prisma.user.upsert({
    where: { email: "manager1@falab.kr" },
    update: {},
    create: {
      email: "manager1@falab.kr",
      name: "Manager1",
      password: managerPassword,
      role: "manager",
    },
  });
  console.log(`✅ Manager user: ${manager.email}`);

  // Create sample user
  const userPassword = await bcrypt.hash("pass.user1", 10);
  const user1 = await prisma.user.upsert({
    where: { email: "user1@falab.kr" },
    update: {},
    create: {
      email: "user1@falab.kr",
      name: "User1",
      password: userPassword,
      role: "user",
    },
  });
  console.log(`✅ User: ${user1.email}`);

  // Create apps
  const apps = [
    {
      title: "Brading Identity Generator",
      description: "브랜드의 핵심 정체성을 정의하고 시각적 이미지 보드를 생성하세요",
      detailDescription: `1) In Put
- 구조화된 프롬프트 속 옵션 선택 클릭
- 브랜드 이름 및 설립 연도 직접 작성

2) Out Put & Download
- 브랜드 소개서
- 브랜드 이미지 보드 및 이미지 생성 Prompt`,
      link: "https://buly.kr/74Xg02V",
      industryTags: JSON.stringify(["Fashion", "Bags", "Shoes", "Beauty"]),
      processTags: JSON.stringify(["Planning"]),
      hasGeminiDemo: false,
      createdBy: admin.id,
    },
    {
      title: "Pictogram Generator",
      description: "브랜드 로고를 생성합니다.",
      detailDescription: `1) In Put
   - 브랜드 네임 Text로 입력
   - 옵션 선택 1: 럭셔리 브랜드 시그니처 //  모던 미니멀 브랜드마크 // 
             패션 라이프스타일 아이콘 // 글로벌 코퍼레이트 심볼 // 친환경 지속가능 마크 //  
             프리미엄 헤리티지 엠블럼 // 다이나믹 스포츠 로고마크 // 
             아티스틱 크리에이티브 심볼 //  테크 이노베이션 아이콘 // 버서타일  멀티유즈 마크
   - 옵션 선택 2: Headwear // Eyewear // Top // Outerwear // Bottom // Legwear //
              Footwear // Bag & Accessories // Accessary // [Enter directly ]

 2) Out Put & Download
   - Brand Pictogram Image // Pictogram Image Prompt`,
      link: "https://buly.kr/Nksj2x",
      industryTags: JSON.stringify(["Fashion", "Bags", "Shoes", "Beauty"]),
      processTags: JSON.stringify(["Planning"]),
      hasGeminiDemo: false,
      createdBy: admin.id,
    },
    {
      title: "Brand Persona Generator",
      description: "브랜드 설명에 맞는 페르소나를 생성합니다.",
      detailDescription: ` 1) In Put
  (1) 브랜드 소개서 Text로 입력

 2) Out Put
  (1) 인구통계학적 특성 (Demographic Characteristics) 
  (2) 심리적 특성 (Psychological Characteristics)
  (3) 라이프스타일 패턴 (Lifestyle Patterns)  //  (4) 패션 관련 행동 (Fashion-Related Behavior)
  (5) 디지털 접점 (Digital Touchpoints)  //  (6) 브랜드 관계 (Brand Relationship)
  (7) 브랜드 사용자 페르소나 (Brand User Description)
  (8) 페르소나 이미지 & 이미지 생성 프롬프트 (Persona Image & Generation Prompt)

 3) Download
  - Persona Image`,
      link: "https://buly.kr/FhOo3sZ",
      industryTags: JSON.stringify(["Fashion", "Bags", "Shoes", "Beauty"]),
      processTags: JSON.stringify(["Planning"]),
      hasGeminiDemo: false,
      createdBy: admin.id,
    },
    {
      title: "Target Persona Generator for Socks",
      description: "양말을 위한 페르소나 생성",
      detailDescription: `1) In Put
   - 브랜드/스토어명 [텍스트]
   - 옵션: 분석 목적 / 상품 카테고리 / 기능성 초점 / 착용 상황 / 성별 / 연령대 /
             가격 / 구매 채널 / 페르소나 깊이

 2) Out Put & Download
   - 페르소나 프로필
   - 페르소나 이미지
   - 구매 여정 분석
   - 구매 동기 & 장벽
   - 마케팅 적용 가이드`,
      link: "https://buly.kr/9iHPmVE",
      industryTags: JSON.stringify(["Socks"]),
      processTags: JSON.stringify(["Planning"]),
      hasGeminiDemo: false,
      createdBy: admin.id,
    },
    {
      title: "Fashion Mood Board Generator",
      description: "무드보드를 생성합니다.",
      detailDescription: `1) In Put
  (1) 브랜드 소개서 Text로 입력
  (2) 옵션 년도 // 옵션 시즌 : 선택

 2) Out Put
  (1) Main Mood Board Image
  (2) Keyword Images
  (3) Core Keywords
  (4) Generated Image Prompts

 3) Download
 - Image
 - PDF`,
      link: "https://buly.kr/5fDc9X0",
      industryTags: JSON.stringify(["Fashion"]),
      processTags: JSON.stringify(["Planning"]),
      hasGeminiDemo: false,
      createdBy: admin.id,
    },
    {
      title: "Global Trend Forecaster",
      description: "트랜드 예측 보고서 생성",
      detailDescription: `1) In Put
   -  옵션: 타겟 시즌 // 타겟 시장 // 카테고리 // 의류 분류

 2) Out Put & Download
   - 메가 트렌드 (MEGA TRENDS)
   - 실루엣 트렌드 (SILHOUETTE TRENDS)
   - 컬러 트렌드 (COLOR TRENDS)
   - 소재 트렌드 (FABRIC TRENDS)
   - 디테일 트렌드 (DETAIL TRENDS)
   - 프린트/패턴 트렌드 (PRINT & PATTERN TRENDS)
   - 스타일링 트렌드 (STYLING TRENDS)
   - 추가 분석 (ADDITIONAL ANALYSIS)
   - PDF 다운로드`,
      link: "https://buly.kr/Cskh2DK",
      industryTags: JSON.stringify(["Fashion", "Bags", "Shoes", "Beauty"]),
      processTags: JSON.stringify(["Planning"]),
      hasGeminiDemo: false,
      createdBy: admin.id,
    },
    {
      title: "Competitor Benchmarking Report",
      description: "벤치마킹 보고서",
      detailDescription: `1) In Put
  (1) 직접 입력
   - 브랜드 소개서 (텍스트 입력 또는 파일 업로드) // 국내외 경쟁브랜드 각각 3개 사

  (2) 옵션[드롭다운]
   ① 분석 기간: 6개월 / 1년
   ② 제품 카테고리: 여성복 / 남성복 / 스포츠웨어 / 액세서리 / 전체

 2) Out Put & Download
   - 경쟁사별 가격·프로모션·출시 일정 비교표
   - 상품 Gap 리스트 및 근거
   - 기회 전략 제안 (액션 플랜 3~5개, 예상 효과·리스크 포함)
   - txt 파일 다운로드`,
      link: "https://buly.kr/H6j8ST6",
      industryTags: JSON.stringify(["Fashion"]),
      processTags: JSON.stringify(["Planning"]),
      hasGeminiDemo: false,
      createdBy: admin.id,
    },
    {
      title: "Trend Radar",
      description: "인스타그램·핀터레스트·패션위크 이미지를 분석해 트렌드 변화를 추적하는 AI 리포트 생성 도구",
      detailDescription: `인풋
- 분석 이미지: 인스타그램, 핀터레스트, 패션위크 등에서 수집 업로드 (최대 10개)
- 옵션[드롭다운]
  ① 분석 카테고리: Womenswear / Menswear / Kidswear / Accessories
  ② 비교 기준 시즌: SS 2025 ~ FW 2026 (트렌드 변화 추적 기준점 설정)

아웃풋 & 다운로드
- JSON 데이터: 자체 데이터베이스 연동, 추가 분석용
- 시각화 대시보드: 팀 미팅, 기획 회의 프레젠테이션
- 전략적 인사이트: 다음 시즌 기획 방향 수립
- HTML 리포트: 클라이언트 보고서, 아카이빙`,
      link: "https://buly.kr/7mCyoD9",
      industryTags: JSON.stringify(["Fashion"]),
      processTags: JSON.stringify(["Planning"]),
      hasGeminiDemo: false,
      createdBy: admin.id,
    },
    {
      title: "Fashion Season Planning",
      description: "브랜드 소개서와 시즌 옵션을 입력하면 콘셉트·무드보드·컬러·소재·디자인·상품 구성까지 완성하는 시즌 기획 도구",
      detailDescription: `인풋
① 브랜드 소개서: Text
② 옵션 년도: 선택
③ 옵션 시즌: 선택
④ 패션 스타일: 선택 or 직접 입력

아웃풋
⑤ 콘셉트, ⑥ 무드보드, ⑦ 컬러, ⑧ 소재, ⑨ 디자인, ⑩ 상품 구성
[기획서, 이미지 보드, 이미지 프롬프트]

다운로드
- PDF
- 이미지 보드`,
      link: "https://buly.kr/Eop19yf",
      industryTags: JSON.stringify(["Fashion"]),
      processTags: JSON.stringify(["Planning"]),
      hasGeminiDemo: false,
      createdBy: admin.id,
    },
    {
      title: "Season Concept Developer",
      description: "브랜드 소개서와 시즌·패션 감성 옵션으로 트렌드 탐색부터 최종 컨셉 추천까지 자동 생성하는 ToT 기반 기획 도구",
      detailDescription: `인풋
① 브랜드 소개서: 직접 입력
② 옵션
  - 년도 [드롭다운]
  - 시즌 [드롭다운]
  - 패션 감성 [드롭다운]

아웃풋 & 다운로드
① 트렌드 탐색 리포트 - 시장동향/트렌드/감성별 분석
② 컨셉 옵션 카드 3~4개 - 무드보드 이미지 + 핵심 아이디어, 장단점, 실행가능성
③ 평가 매트릭스 - 4개 기준별 점수 표
④ 최종 추천 - 선택 근거 및 실행 주의사항`,
      link: "https://buly.kr/CM0d3p0",
      industryTags: JSON.stringify(["Fashion"]),
      processTags: JSON.stringify(["Planning"]),
      hasGeminiDemo: false,
      createdBy: admin.id,
    },
  ];

  for (const app of apps) {
    await prisma.appCard.upsert({
      where: { id: app.title.toLowerCase().replace(/\s+/g, "-") },
      update: {},
      create: {
        id: app.title.toLowerCase().replace(/\s+/g, "-"),
        ...app,
      },
    });
  }
  console.log(`✅ ${apps.length} apps seeded`);

  // Create sample posts
  const posts = [
    {
      type: "notice",
      title: "Hitchhiker's Guide to Fashion AI에 오신 것을 환영합니다!",
      content: "패션과 AI의 교차점에서 새로운 가치를 만들어가는 커뮤니티에 오신 것을 환영합니다. 다양한 AI 도구를 탐색하고, 전문가들과 의견을 나누어 보세요.",
      isPinned: true,
      authorId: admin.id,
    },
    {
      type: "article",
      title: "2025 패션 AI 트렌드 리포트: 생성형 AI가 바꾸는 패션의 미래",
      content: "2025년 패션 산업에서 AI 기술은 단순한 보조 도구를 넘어 창작의 핵심 파트너로 진화하고 있습니다. 이 아티클에서는 최신 트렌드를 분석합니다.",
      isPinned: false,
      authorId: manager.id,
    },
    {
      type: "forum",
      title: "패션 디자인에서 Generative AI 활용 방법론 토론",
      content: "최근 Generative AI를 활용한 패션 디자인 사례가 늘고 있습니다. 여러분의 경험을 공유해주세요.",
      isPinned: false,
      authorId: admin.id,
    },
    {
      type: "job",
      title: "[채용] 패션 테크 스타트업 AI 엔지니어 채용",
      content: "패션과 AI를 결합한 혁신적인 프로덕트를 만들 AI 엔지니어를 찾습니다. ML/DL 경험 3년 이상.",
      isPinned: false,
      authorId: manager.id,
    },
  ];

  for (const post of posts) {
    await prisma.post.create({ data: post });
  }
  console.log(`✅ ${posts.length} posts seeded`);

  console.log("\n🎉 Seed completed!");
  console.log("  Admin login: admin@falab.kr / pass.admin");
  console.log("  Manager login: manager1@falab.kr / pass.manager1");
  console.log("  User login: user1@falab.kr / pass.user1");
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
