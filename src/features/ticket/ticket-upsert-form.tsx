/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useActionState, useRef } from "react";
import FieldError from "@/components/form/field-error";
import Form from "@/components/form/form";
import SubmitButton from "@/components/form/SubmitButton";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { upsertTicket } from "@/features/actions/upsert-ticket";
import {
  ActionState,
  EMPTY_ACTION_STATE,
} from "@/features/utils/to-action-state";
import type { Ticket } from "@/generated/prisma/client";
import { fromCent } from "@/utils/currency";
import DatePicker, { type DateReset } from "../../components/date-picker";
type TicketUpsertForm = {
  ticket?: Ticket;
};

const TicketUpsertForm = ({ ticket }: TicketUpsertForm) => {
  const [state, formAction] = useActionState(
    upsertTicket.bind(null, ticket?.id),
    EMPTY_ACTION_STATE
  );
  console.log(state);
  const datePickerImperativeRef = useRef<DateReset>(null);

  const handleSuccess = (state: ActionState) => {
    datePickerImperativeRef.current?.reset();
  };
  const handleError = (state: ActionState) => {};
  return (
    <Form
      state={state}
      action={formAction}
      className="flex flex-col gap-y-2"
      onSuccessState={handleSuccess}
      onErrorState={handleError}
    >
      <Label htmlFor="title">Title</Label>
      <Input
        type="text"
        name="title"
        id="title"
        defaultValue={(state?.payload?.get("title") as string) ?? ticket?.title}
      />
      <FieldError actionState={state} name="title" />
      <Label htmlFor="description">Description</Label>
      <Textarea
        name="description"
        id="description"
        defaultValue={
          (state.payload?.get("description") as string) ?? ticket?.description
        }
      />
      <FieldError actionState={state} name="description" />
      <div className="flex gap-x-2 mb-1">
        <div className="flex-1">
          <Label htmlFor="deadline" className="mb-1">
            Deadline
          </Label>
          <DatePicker
            id="deadline"
            // key={state.timestamp}
            ref={datePickerImperativeRef}
            name="deadline"
            defaultValue={
              (state?.payload?.get("deadline") as string) ?? ticket?.deadline
            }
          />
          <FieldError actionState={state} name="deadline" />
        </div>
        <div className="flex-1">
          <Label htmlFor="bounty" className="mb-1">
            Bounty
          </Label>
          <Input
            type="number"
            name="bounty"
            id="bounty"
            step=".01"
            defaultValue={
              (state?.payload?.get("bounty") as string | null) ??
              (ticket?.bounty ? fromCent(ticket?.bounty) : "Free")
            }
          />
          <FieldError actionState={state} name="bounty" />
        </div>
      </div>
      <SubmitButton label={ticket ? "Edit ticket" : "Create ticket"} />
    </Form>
  );
};

export default TicketUpsertForm;
