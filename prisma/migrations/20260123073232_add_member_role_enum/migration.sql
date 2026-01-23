-- CreateEnum: Create MemberRole enum
CREATE TYPE "MemberRole" AS ENUM ('owner', 'admin', 'member');

-- AlterTable: Convert member.role from text to MemberRole enum
ALTER TABLE "member" 
  ALTER COLUMN "role" DROP DEFAULT,
  ALTER COLUMN "role" TYPE "MemberRole" USING "role"::"MemberRole",
  ALTER COLUMN "role" SET DEFAULT 'member';

-- AlterTable: Convert invitation.role from text to MemberRole enum (nullable)
ALTER TABLE "invitation" 
  ALTER COLUMN "role" TYPE "MemberRole" USING "role"::"MemberRole";
