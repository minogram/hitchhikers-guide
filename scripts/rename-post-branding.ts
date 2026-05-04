import * as dotenv from "dotenv";
import { PrismaClient } from "@prisma/client";
import { PrismaLibSql } from "@prisma/adapter-libsql";

dotenv.config({ path: ".env.local" });
dotenv.config();

const databaseUrl = process.env.DATABASE_URL ?? "file:./prisma/dev.db";
const databaseAuthToken = process.env.DATABASE_AUTH_TOKEN;

const adapter = new PrismaLibSql({
  url: databaseUrl,
  authToken: databaseAuthToken,
});

const prisma = new PrismaClient({ adapter });

const replacements: Array<[string, string]> = [
  ["Hitchhiker's Guide to Fashion AI", "FALAB"],
  ["HGFAI", "FALAB"],
  ["AI Literacy Lab", "AI 리터러시 연구소"],
];

function replaceBranding(text: string) {
  return replacements.reduce(
    (current, [from, to]) => current.replaceAll(from, to),
    text
  );
}

async function main() {
  const posts = await prisma.post.findMany({
    select: { id: true, title: true, content: true },
  });

  let updatedCount = 0;

  for (const post of posts) {
    const nextTitle = replaceBranding(post.title);
    const nextContent = replaceBranding(post.content);

    if (nextTitle === post.title && nextContent === post.content) {
      continue;
    }

    await prisma.post.update({
      where: { id: post.id },
      data: {
        title: nextTitle,
        content: nextContent,
      },
    });

    updatedCount += 1;
    console.log(`updated post ${post.id}: ${post.title} -> ${nextTitle}`);
  }

  console.log(`Done: updated ${updatedCount} posts`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });