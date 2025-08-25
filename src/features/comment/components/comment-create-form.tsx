
"use client";

import { useActionState, useEffect, useRef } from "react";
import FieldError from "@/components/form/field-error";
import Form from "@/components/form/form";
import SubmitButton from "@/components/form/submit-button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { upsertComment } from "@/features/comment/actions/upsert-comment";
import {
	EMPTY_ACTION_STATE,
	type ActionState,
} from "@/features/utils/to-action-state";

type CommentCreateFormProps = {
	ticketId: string;
	commentId?: string;
	initialContent?: string;
	onCancel?: () => void;
};

const CommentCreateForm = ({ 
	ticketId, 
	commentId, 
	initialContent = "", 
	onCancel 
}: CommentCreateFormProps) => {
	// Create a wrapper function that matches useActionState signature
	const commentAction = async (
		state: ActionState<unknown>,
		formData: FormData
	): Promise<ActionState<unknown>> => {
		return upsertComment(commentId, ticketId, state, formData);
	};	

	const [state, formAction] = useActionState(
		commentAction,
		EMPTY_ACTION_STATE,
	);

	const textareaRef = useRef<HTMLTextAreaElement>(null);

	// Populate form when editing
	useEffect(() => {
		if (commentId && initialContent && textareaRef.current) {
			textareaRef.current.value = initialContent;
		}
	}, [commentId, initialContent]);

	// Focus textarea when editing
	useEffect(() => {
		if (commentId && textareaRef.current) {
			textareaRef.current.focus();
		}
	}, [commentId]);

	const handleSuccess = () => {
		// Reset form on success
		if (textareaRef.current) {
			textareaRef.current.value = "";
		}
		// Call onCancel if provided (for edit mode)
		if (onCancel) {
			onCancel();
		}
	};

	return (
		<Form
			state={state}
			action={formAction}
			className="grid gap-y-2"
			onSuccessState={handleSuccess}
		>
			<div>
				<Label htmlFor="content">
					{commentId ? "Edit comment" : "Add a comment"}
				</Label>
				<Textarea
					ref={textareaRef}
					name="content"
					id="content"
					placeholder="Write your comment here..."
					className="min-h-25 field-sizing-content"
					defaultValue={state?.payload?.get("content") as string || initialContent}
				/>
				<FieldError actionState={state} name="content" />
			</div>
			<div className="flex gap-2">
				<SubmitButton label={commentId ? "Update comment" : "Post comment"} />
				{commentId && onCancel && (
					<button
						type="button"
						onClick={onCancel}
						className="px-4 py-2 text-sm border rounded-md hover:bg-gray-50"
					>
						Cancel
					</button>
				)}
			</div>
		</Form>
	);
};

export default CommentCreateForm;
