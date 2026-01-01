"use client";

import { Suspense, useActionState, useId, useRef } from "react";
import { DatePicker, type DateReset } from "@/components/date-picker";

import FieldError from "@/components/form/field-error";
import Form from "@/components/form/form";
import SubmitButton from "@/components/form/submit-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { Ticket } from "@/generated/prisma/client";
import { fromCent } from "@/utils/currency";
import { EMPTY_ACTION_STATE } from "@/utils/to-action-state";
import type { upsertTicket } from "../actions/upsert-ticket";

interface TicketUpsertFormProps {
  ticket?: Ticket;
  upsertTicketAction: typeof upsertTicket;
}

const TicketUpsertForm = ({
  ticket,
  upsertTicketAction,
}: TicketUpsertFormProps) => {
  const titleId = useId();
  const descriptionId = useId();
  const deadlineId = useId();
  const bountyId = useId();
  const [actionState, action] = useActionState(
    upsertTicketAction.bind(null, ticket?.id),
    EMPTY_ACTION_STATE,
  );

  const datePickerImperativeHandleRef = useRef<DateReset>(null);

  const handleSuccess = () => {
    datePickerImperativeHandleRef.current?.reset();
  };

  return (
    <Form action={action} onSuccessState={handleSuccess} state={actionState}>
      <Label htmlFor={titleId}>Title</Label>
      <Input
        defaultValue={
          (actionState.payload?.get("title") as string) ?? ticket?.title
        }
        id={titleId}
        name="title"
        type="text"
      />
      <FieldError actionState={actionState} name="title" />

      <Label htmlFor={descriptionId}>Content</Label>
      <Textarea
        defaultValue={
          (actionState.payload?.get("description") as string) ??
          ticket?.description
        }
        id={descriptionId}
        name="description"
      />
      <FieldError actionState={actionState} name="description" />

      <div className="mb-1 flex gap-x-2">
        <div className="w-1/2">
          <Label htmlFor={deadlineId}>Deadline</Label>
          <Suspense fallback={null}>
            <DatePicker
              defaultValue={
                (actionState.payload?.get("deadline") as string) ??
                ticket?.deadline
              }
              id={deadlineId}
              name="deadline"
              ref={datePickerImperativeHandleRef}
            />
          </Suspense>
          <FieldError actionState={actionState} name="deadline" />
        </div>
        <div className="w-1/2">
          <Label htmlFor={bountyId}>Bounty ($)</Label>
          <Input
            defaultValue={
              (actionState.payload?.get("bounty") as string) ??
              (ticket?.bounty ? fromCent(ticket?.bounty) : "")
            }
            id={bountyId}
            name="bounty"
            step=".01"
            type="number"
          />
          <FieldError actionState={actionState} name="bounty" />
        </div>
      </div>

      <SubmitButton label={ticket ? "Edit" : "Create"} />
    </Form>
  );
};

export { TicketUpsertForm };
