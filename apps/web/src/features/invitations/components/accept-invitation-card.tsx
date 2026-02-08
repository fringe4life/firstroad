"use client";

import { useActionState } from "react";
import { FieldError } from "@/components/form/field-error";
import { Form } from "@/components/form/form";
import { SubmitButton } from "@/components/form/submit-button";
import { EMPTY_ACTION_STATE } from "@/utils/to-action-state";
import { invitationDecisionAction } from "../actions/invitation-decision";
import type { InvitationDetails } from "../queries/get-invitation";

interface AcceptInvitationCardProps {
  invitation: InvitationDetails;
}

const AcceptInvitationCard = ({ invitation }: AcceptInvitationCardProps) => {
  const [state, action] = useActionState(
    invitationDecisionAction.bind(null, invitation.id),
    EMPTY_ACTION_STATE,
  );

  const isExpired = new Date(invitation.expiresAt) < new Date();

  if (isExpired) {
    return (
      <div className="space-y-4 text-center">
        <p className="text-muted-foreground">
          This invitation has expired. Please contact the organisation
          administrator for a new invitation.
        </p>
      </div>
    );
  }

  if (invitation.status !== "pending") {
    return (
      <div className="space-y-4 text-center">
        <p className="text-muted-foreground">
          This invitation has already been {invitation.status}.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2 text-center">
        <p className="text-muted-foreground">
          You have been invited to join{" "}
          <span className="font-semibold text-foreground">
            {invitation.organizationName}
          </span>{" "}
          as a{" "}
          <span className="font-semibold text-foreground">
            {invitation.role}
          </span>
          .
        </p>
        {invitation.inviterName && (
          <p className="text-muted-foreground text-sm">
            Invited by: {invitation.inviterName}
          </p>
        )}
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
        <Form action={action} state={state}>
          <SubmitButton
            label="Accept Invitation"
            name="decision"
            value="accept"
          />
          <SubmitButton
            label="Decline"
            name="decision"
            value="reject"
            variant="destructive"
          />
          <FieldError actionState={state} name="root" />
        </Form>
      </div>
    </div>
  );
};

export { AcceptInvitationCard };
