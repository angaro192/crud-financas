/*
  Warnings:

  - Added the required column `userId` to the `FinancialTransaction` table without a default value. This is not possible if the table is not empty.

*/
-- Create a default user for existing transactions if no users exist
INSERT INTO "public"."User" ("id", "name", "email", "password", "createdAt", "updatedAt")
SELECT 'default-user-id', 'Default User', 'default@myfinance.com', '$2b$10$defaultpasswordhash', NOW(), NOW()
WHERE NOT EXISTS (SELECT 1 FROM "public"."User");

-- AlterTable: Add userId column with a default value for existing records
ALTER TABLE "public"."FinancialTransaction" ADD COLUMN "userId" TEXT;

-- Update existing records to use the first available user or the default user
UPDATE "public"."FinancialTransaction" 
SET "userId" = (
  SELECT "id" FROM "public"."User" LIMIT 1
)
WHERE "userId" IS NULL;

-- Make userId column NOT NULL after updating existing records
ALTER TABLE "public"."FinancialTransaction" ALTER COLUMN "userId" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "public"."FinancialTransaction" ADD CONSTRAINT "FinancialTransaction_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
