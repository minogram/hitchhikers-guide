-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_AppCard" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "thumbnail" TEXT NOT NULL DEFAULT '/placeholder-app.svg',
    "description" TEXT NOT NULL,
    "detailDescription" TEXT,
    "link" TEXT NOT NULL,
    "industryTags" TEXT NOT NULL DEFAULT '[]',
    "processTags" TEXT NOT NULL DEFAULT '[]',
    "tags" TEXT NOT NULL DEFAULT '[]',
    "hasGeminiDemo" BOOLEAN NOT NULL DEFAULT false,
    "isVisible" BOOLEAN NOT NULL DEFAULT true,
    "likeCount" INTEGER NOT NULL DEFAULT 0,
    "createdBy" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "AppCard_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_AppCard" ("createdAt", "createdBy", "description", "detailDescription", "hasGeminiDemo", "id", "industryTags", "isVisible", "likeCount", "link", "processTags", "thumbnail", "title", "updatedAt") SELECT "createdAt", "createdBy", "description", "detailDescription", "hasGeminiDemo", "id", "industryTags", "isVisible", "likeCount", "link", "processTags", "thumbnail", "title", "updatedAt" FROM "AppCard";
DROP TABLE "AppCard";
ALTER TABLE "new_AppCard" RENAME TO "AppCard";
CREATE TABLE "new_TagOption" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "type" TEXT NOT NULL DEFAULT 'tag',
    "label" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_TagOption" ("createdAt", "id", "label", "type") SELECT "createdAt", "id", "label", "type" FROM "TagOption";
DROP TABLE "TagOption";
ALTER TABLE "new_TagOption" RENAME TO "TagOption";
CREATE UNIQUE INDEX "TagOption_type_label_key" ON "TagOption"("type", "label");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
