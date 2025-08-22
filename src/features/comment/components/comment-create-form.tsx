
"use client";

import { useActionState } from "react";
import FieldError from "@/components/form/field-error";
import Form from "@/components/form/form";
import SubmitButton from "@/components/form/SubmitButton";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { createComment } from "@/features/comment/actions/create-comment";
import {
	EMPTY_ACTION_STATE,
} from "@/features/utils/to-action-state";

type CommentCreateFormProps = {
	ticketId: string;
};

const CommentCreateForm = ({ ticketId }: CommentCreateFormProps) => {
	const [state, formAction] = useActionState(
		createComment.bind(null, ticketId),
		EMPTY_ACTION_STATE,
	);

	return (
		<Form
			state={state}
			action={formAction}
			className="grid gap-y-2"
		>
			<div className="space-y-2">
				<Label htmlFor="content">Add a comment</Label>
				<Textarea
					name="content"
					id="content"
					placeholder="Write your comment here..."
					className="min-h-25 field-sizing-content"
					defaultValue={state?.payload?.get("content") as string | undefined ?? ""}
				/>
				<FieldError actionState={state} name="content" />
			</div>
			<SubmitButton label="Post comment" />
		</Form>
	);
};

export default CommentCreateForm;
