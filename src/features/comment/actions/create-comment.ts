"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod/v4";
import {
  type ActionState,
  fromErrorToActionState,
  toActionState,
} from "@/features/utils/to-action-state";
import { prisma } from "@/lib/prisma";
import { getAuthOrRedirect } from "@/features/auth/queries/get-auth-or-redirect";
import { ticketEditPath } from "@/path";

const createCommentSchema = z.object({
  content: z.string().min(1, "Comment cannot be empty").max(1024, "Comment is too long"),
});

const createComment = async (
  ticketId: string,
  _state: ActionState,
  formData: FormData
): Promise<ActionState> => {
  console.log("🔍 createComment - Starting comment creation");
  console.log("🔍 createComment - ticketId:", ticketId);
  
  const session = await getAuthOrRedirect();
  console.log("🔍 createComment - Session user ID:", session.user?.id);
  console.log("🔍 createComment - Session user email:", session.user?.email);
  
  try {
    // Verify the ticket exists
    console.log("🔍 createComment - Verifying ticket exists...");
    const ticket = await prisma.ticket.findUnique({
      where: { id: ticketId },
    });
    console.log("🔍 createComment - Ticket found:", !!ticket);

    if (!ticket) {
      console.log("❌ createComment - Ticket not found");
      return toActionState("Ticket not found", "ERROR");
    }

    if(!session.user) {
        console.log("❌ createComment - User not found");
        return toActionState("User not found", "ERROR");
    }

    console.log("🔍 createComment - Parsing form data...");
    const data = createCommentSchema.parse({
      content: formData.get("content"),
    });
    console.log("🔍 createComment - Parsed content:", data.content);

    console.log("🔍 createComment - Creating comment in database...");
    console.log("🔍 createComment - Comment data:", {
      content: data.content,
      ticketId,
      userId: session.user?.id,
    });

    await prisma.comment.create({
      data: {
        content: data.content,
        ticketId,
        userId: session.user?.id as string,
      },
    });

    console.log("✅ createComment - Comment created successfully");
    
    // Revalidate the ticket page to show the new comment
    revalidatePath(ticketEditPath(ticketId));
    
    return toActionState("Comment created successfully", "SUCCESS");
  } catch (err: unknown) {
    console.error("❌ createComment - Error creating comment:", err);
    console.error("❌ createComment - Error details:", {
      name: (err as Error).name,
      message: (err as Error).message,
      stack: (err as Error).stack,
    });
    return fromErrorToActionState(err, formData);
  }
};

export { createComment };
