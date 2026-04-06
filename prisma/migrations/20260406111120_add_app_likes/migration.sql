-- CreateTable
CREATE TABLE "AppLike" (
    "userId" TEXT NOT NULL,
    "appId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY ("userId", "appId"),
    CONSTRAINT "AppLike_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "AppLike_appId_fkey" FOREIGN KEY ("appId") REFERENCES "AppCard" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

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
    "industryTags" TEXT NOT NULL,
    "processTags" TEXT NOT NULL,
    "hasGeminiDemo" BOOLEAN NOT NULL DEFAULT false,
    "likeCount" INTEGER NOT NULL DEFAULT 0,
    "createdBy" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "AppCard_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_AppCard" ("createdAt", "createdBy", "description", "detailDescription", "hasGeminiDemo", "id", "industryTags", "link", "processTags", "thumbnail", "title", "updatedAt") SELECT "createdAt", "createdBy", "description", "detailDescription", "hasGeminiDemo", "id", "industryTags", "link", "processTags", "thumbnail", "title", "updatedAt" FROM "AppCard";
DROP TABLE "AppCard";
ALTER TABLE "new_AppCard" RENAME TO "AppCard";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
