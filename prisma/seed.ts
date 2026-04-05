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

  // Create sample apps
  const apps = [
    {
      title: "FashionGen AI",
      description: "AI 기반 패션 디자인 생성 도구. 스타일과 트렌드를 반영한 디자인을 자동으로 생성합니다.",
      detailDescription: "FashionGen AI는 최신 생성형 AI 기술을 활용하여 패션 디자이너의 창작 과정을 혁신합니다. 트렌드 데이터와 사용자의 스타일 선호도를 분석하여 독창적인 패션 디자인을 제안합니다.",
      link: "https://example.com/fashiongen",
      industryTags: JSON.stringify(["Fashion"]),
      processTags: JSON.stringify(["Design"]),
      hasGeminiDemo: true,
      createdBy: admin.id,
    },
    {
      title: "BagVision",
      description: "핸드백 디자인 최적화를 위한 AI 비전 솔루션.",
      detailDescription: "BagVision은 핸드백 및 가방 카테고리에 특화된 AI 비전 시스템입니다. 디자인 초안에서 최종 제품까지의 과정을 시뮬레이션하고, 시장 반응을 예측합니다.",
      link: "https://example.com/bagvision",
      industryTags: JSON.stringify(["Bags"]),
      processTags: JSON.stringify(["Design", "Planning"]),
      hasGeminiDemo: false,
      createdBy: admin.id,
    },
    {
      title: "ShoeForge",
      description: "3D 신발 프로토타입 생성 AI. 제조 공정까지 자동 설계.",
      detailDescription: "ShoeForge는 3D 모델링과 AI를 결합하여 신발 프로토타입을 빠르게 생성합니다. 소재 선택부터 생산 공정 최적화까지 토탈 솔루션을 제공합니다.",
      link: "https://example.com/shoeforge",
      industryTags: JSON.stringify(["Shoes"]),
      processTags: JSON.stringify(["Production", "Design"]),
      hasGeminiDemo: false,
      createdBy: admin.id,
    },
    {
      title: "BeautyTrend Analyzer",
      description: "SNS 데이터를 분석하여 뷰티 트렌드를 예측하는 AI 도구.",
      detailDescription: "BeautyTrend Analyzer는 소셜 미디어, 뷰티 블로그, 전자상거래 데이터를 실시간으로 분석하여 뷰티 트렌드를 예측합니다.",
      link: "https://example.com/beautytrend",
      industryTags: JSON.stringify(["Beauty"]),
      processTags: JSON.stringify(["Planning", "Commerce"]),
      hasGeminiDemo: false,
      createdBy: admin.id,
    },
    {
      title: "StyleCommerce AI",
      description: "패션 이커머스를 위한 개인화 추천 엔진.",
      detailDescription: "StyleCommerce AI는 고객의 취향, 구매 이력, 트렌드 분석을 통합하여 초개인화된 패션 아이템 추천을 제공합니다.",
      link: "https://example.com/stylecommerce",
      industryTags: JSON.stringify(["Fashion", "Beauty"]),
      processTags: JSON.stringify(["Commerce"]),
      hasGeminiDemo: true,
      createdBy: admin.id,
    },
    {
      title: "FabricMind",
      description: "AI 기반 패브릭 분석 및 소재 추천 시스템.",
      detailDescription: "FabricMind는 이미지 분석과 물성 데이터를 결합하여 최적의 패브릭을 추천합니다.",
      link: "https://example.com/fabricmind",
      industryTags: JSON.stringify(["Fashion", "Bags", "Shoes"]),
      processTags: JSON.stringify(["Production", "Planning"]),
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
