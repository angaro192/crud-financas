-- CreateExtension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- AlterTable
-- Step 1: Add new UUID columns
ALTER TABLE "User" ADD COLUMN "new_id" UUID DEFAULT gen_random_uuid();
ALTER TABLE "FinancialTransaction" ADD COLUMN "new_id" UUID DEFAULT gen_random_uuid();
ALTER TABLE "FinancialTransaction" ADD COLUMN "new_userId" UUID;

-- Step 2: Create mapping table to preserve relationships
CREATE TEMPORARY TABLE user_id_mapping AS 
SELECT id as old_id, new_id FROM "User";

-- Step 3: Update FinancialTransaction.new_userId with corresponding UUID
UPDATE "FinancialTransaction" 
SET "new_userId" = user_id_mapping.new_id 
FROM user_id_mapping 
WHERE "FinancialTransaction"."userId" = user_id_mapping.old_id;

-- Step 4: Create unique indexes on new columns
CREATE UNIQUE INDEX "User_new_id_key" ON "User"("new_id");
CREATE UNIQUE INDEX "FinancialTransaction_new_id_key" ON "FinancialTransaction"("new_id");

-- Step 5: Drop old constraints and indexes
ALTER TABLE "FinancialTransaction" DROP CONSTRAINT "FinancialTransaction_userId_fkey";
ALTER TABLE "FinancialTransaction" DROP CONSTRAINT "FinancialTransaction_pkey";
ALTER TABLE "User" DROP CONSTRAINT "User_pkey";

-- Step 6: Drop old columns
ALTER TABLE "User" DROP COLUMN "id";
ALTER TABLE "FinancialTransaction" DROP COLUMN "id";
ALTER TABLE "FinancialTransaction" DROP COLUMN "userId";

-- Step 7: Rename new columns to original names
ALTER TABLE "User" RENAME COLUMN "new_id" TO "id";
ALTER TABLE "FinancialTransaction" RENAME COLUMN "new_id" TO "id";
ALTER TABLE "FinancialTransaction" RENAME COLUMN "new_userId" TO "userId";

-- Step 8: Create new primary keys and constraints
ALTER TABLE "User" ADD CONSTRAINT "User_pkey" PRIMARY KEY ("id");
ALTER TABLE "FinancialTransaction" ADD CONSTRAINT "FinancialTransaction_pkey" PRIMARY KEY ("id");

-- Step 9: Add foreign key constraint
ALTER TABLE "FinancialTransaction" ADD CONSTRAINT "FinancialTransaction_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Step 10: Create indexes for performance
CREATE INDEX "FinancialTransaction_userId_idx" ON "FinancialTransaction"("userId");