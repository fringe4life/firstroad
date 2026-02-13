-- CreateEnum: Create ResourceType enum
CREATE TYPE "ResourceType" AS ENUM ('TICKET', 'COMMENT');

-- CreateTable: member_permission
CREATE TABLE "member_permission" (
    "id" TEXT NOT NULL,
    "memberId" TEXT NOT NULL,
    "resourceType" "ResourceType" NOT NULL,
    "canCreate" BOOLEAN NOT NULL DEFAULT true,
    "canUpdate" BOOLEAN NOT NULL DEFAULT true,
    "canDelete" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "member_permission_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "member_permission_memberId_resourceType_key" ON "member_permission"("memberId", "resourceType");

-- CreateIndex
CREATE INDEX "member_permission_memberId_idx" ON "member_permission"("memberId");

-- AddForeignKey
ALTER TABLE "member_permission" ADD CONSTRAINT "member_permission_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "member"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Migrate data: for each Member, create MemberPermission with resourceType TICKET
INSERT INTO "member_permission" ("id", "memberId", "resourceType", "canCreate", "canUpdate", "canDelete")
SELECT
    gen_random_uuid()::text,
    "id",
    'TICKET'::"ResourceType",
    true,
    COALESCE("canUpdateTicket", true),
    COALESCE("canDeleteTicket", true)
FROM "member";

-- AlterTable: Drop canDeleteTicket and canUpdateTicket from member
ALTER TABLE "member" DROP COLUMN "canDeleteTicket";
ALTER TABLE "member" DROP COLUMN "canUpdateTicket";
