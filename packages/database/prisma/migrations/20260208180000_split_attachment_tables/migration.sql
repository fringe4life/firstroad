-- Rename existing Attachment table to TicketAttachment
ALTER TABLE "Attachment" RENAME TO "TicketAttachment";

-- Create new CommentAttachment table
CREATE TABLE "CommentAttachment" (
  "id"        TEXT NOT NULL,
  "name"      TEXT NOT NULL,
  "commentId" TEXT NOT NULL,
  CONSTRAINT "CommentAttachment_pkey" PRIMARY KEY ("id")
);

-- Foreign key from CommentAttachment to Comment
ALTER TABLE "CommentAttachment"
ADD CONSTRAINT "CommentAttachment_commentId_fkey"
FOREIGN KEY ("commentId") REFERENCES "Comment"("id")
ON DELETE CASCADE ON UPDATE CASCADE;

-- Index on commentId for faster lookups
CREATE INDEX "CommentAttachment_commentId_idx" ON "CommentAttachment"("commentId");

