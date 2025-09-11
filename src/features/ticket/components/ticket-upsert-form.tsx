"use client";

import { useActionState, useId, useRef } from "react";
import DatePicker, { type DateReset } from "@/components/date-picker";
import FieldError from "@/components/form/field-error";
import Form from "@/components/form/form";
import SubmitButton from "@/components/form/submit-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { Ticket } from "@/generated/prisma/client";
import { fromCent } from "@/utils/currency";
import { EMPTY_ACTION_STATE } from "@/utils/to-action-state";
import { upsertTicket } from "../actions/upsert-ticket";

type TicketUpsertFormProps = {
	ticket?: Ticket;
};

const TicketUpsertForm = ({ ticket }: TicketUpsertFormProps) => {
	const titleId = useId();
	const descriptionId = useId();
	const deadlineId = useId();
	const bountyId = useId();
	const [actionState, action] = useActionState(
		upsertTicket.bind(null, ticket?.id),
		EMPTY_ACTION_STATE,
	);

	const datePickerImperativeHandleRef = useRef<DateReset>(null);

	const handleSuccess = () => {
		datePickerImperativeHandleRef.current?.reset();
	};

	return (
		<Form state={actionState} action={action} onSuccessState={handleSuccess}>
			<Label htmlFor={titleId}>Title</Label>
			<Input
				id={titleId}
				name="title"
				type="text"
				defaultValue={
					(actionState.payload?.get("title") as string) ?? ticket?.title
				}
			/>
			<FieldError actionState={actionState} name="title" />

			<Label htmlFor={descriptionId}>Content</Label>
			<Textarea
				id={descriptionId}
				name="description"
				defaultValue={
					(actionState.payload?.get("description") as string) ??
					ticket?.description
				}
			/>
			<FieldError actionState={actionState} name="description" />

			<div className="mb-1 flex gap-x-2">
				<div className="w-1/2">
					<Label htmlFor={deadlineId}>Deadline</Label>
					<DatePicker
						id={deadlineId}
						name="deadline"
						defaultValue={
							(actionState.payload?.get("deadline") as string) ??
							ticket?.deadline
						}
						ref={datePickerImperativeHandleRef}
					/>
					<FieldError actionState={actionState} name="deadline" />
				</div>
				<div className="w-1/2">
					<Label htmlFor={bountyId}>Bounty ($)</Label>
					<Input
						id={bountyId}
						name="bounty"
						type="number"
						step=".01"
						defaultValue={
							(actionState.payload?.get("bounty") as string) ??
							(ticket?.bounty ? fromCent(ticket?.bounty) : "")
						}
					/>
					<FieldError actionState={actionState} name="bounty" />
				</div>
			</div>

			<SubmitButton label={ticket ? "Edit" : "Create"} />
		</Form>
	);
};

export default TicketUpsertForm;
