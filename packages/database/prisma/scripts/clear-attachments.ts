import { all } from "@prisma/orm-postgres/orm-client";
import { orm } from "../../src/index.ts";

const main = async () => {
  const deletedCommentAttachments = await orm.CommentAttachment.where(
    all(),
  ).deleteAndCount();
  const deletedTicketAttachments = await orm.TicketAttachment.where(
    all(),
  ).deleteAndCount();

  console.log(
    `Cleared ${deletedCommentAttachments} comment attachments and ${deletedTicketAttachments} ticket attachments.`,
  );
};

main().catch(() => {
  process.exit(1);
});
