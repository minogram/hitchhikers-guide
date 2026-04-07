import { PrismaClient } from "@prisma/client";
import { PrismaLibSql } from "@prisma/adapter-libsql";

const adapter = new PrismaLibSql({ url: "file:dev.db" });
const prisma = new PrismaClient({ adapter });

async function main() {
  const apps = await prisma.appCard.findMany({
    select: { id: true, industryTags: true, processTags: true },
  });

  for (const app of apps) {
    const industry: string[] = JSON.parse(app.industryTags);
    const process_: string[] = JSON.parse(app.processTags);
    const merged = [...new Set([...industry, ...process_])];
    await prisma.appCard.update({
      where: { id: app.id },
      data: { tags: JSON.stringify(merged) },
    });
  }

  await prisma.tagOption.updateMany({ data: { type: "tag" } });
  console.log(`Done: merged ${apps.length} apps`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
