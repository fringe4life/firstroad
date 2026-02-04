"use server";

import { object, picklist, safeParse } from "valibot";
import type { ActionState } from "@/utils/to-action-state";
import { fromErrorToActionState } from "@/utils/to-action-state";
import { acceptInvitation } from "./accept-invitation";
import { rejectInvitation } from "./reject-invitation";

const invitationDecisionSchema = object({
  decision: picklist(["accept", "reject"], "Invalid decision"),
});

// biome-ignore lint/suspicious/useAwait: must be async to "use server"
const invitationDecisionAction = async (
  invitationId: string,
  prevState: ActionState,
  formData: FormData,
): Promise<ActionState> => {
  const result = safeParse(invitationDecisionSchema, {
    decision: formData.get("decision"),
  });

  if (!result.success) {
    return fromErrorToActionState(result.issues);
  }

  if (result.output.decision === "accept") {
    return acceptInvitation(invitationId, prevState);
  }

  return rejectInvitation(invitationId, prevState);
};

export { invitationDecisionAction };
