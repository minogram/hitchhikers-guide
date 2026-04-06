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
