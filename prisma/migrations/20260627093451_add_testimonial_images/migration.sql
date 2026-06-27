-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Testimonial" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "role" TEXT,
    "content" TEXT NOT NULL,
    "rating" INTEGER NOT NULL DEFAULT 5,
    "avatar" TEXT,
    "images" TEXT,
    "visible" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_Testimonial" ("avatar", "content", "createdAt", "id", "name", "rating", "role", "updatedAt", "visible") SELECT "avatar", "content", "createdAt", "id", "name", "rating", "role", "updatedAt", "visible" FROM "Testimonial";
DROP TABLE "Testimonial";
ALTER TABLE "new_Testimonial" RENAME TO "Testimonial";
PRAGMA foreign_key_check("Testimonial");
PRAGMA foreign_keys=ON;
