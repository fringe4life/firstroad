"use client";

import { useActionState, useId, useState } from "react";
import { FieldError } from "@/components/form/field-error";
import { Form } from "@/components/form/form";
import { SubmitButton } from "@/components/form/submit-button";
import { Button } from "@/components/ui/button";
import { DialogClose, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { EMPTY_ACTION_STATE } from "@/utils/to-action-state";
import type { updateOrganisation } from "../actions/update-organisation";

const UpdateOrganisationForm = ({
  organizationId,
  organizationName,
  updateOrganisationAction,
  onSuccess,
}: {
  organizationId: string;
  organizationName: string;
  updateOrganisationAction: typeof updateOrganisation;
  onSuccess: () => void;
}) => {
  const [state, action] = useActionState(
    updateOrganisationAction,
    EMPTY_ACTION_STATE,
  );
  const [name, setName] = useState(organizationName);
  const organisationNameId = useId();
  const isSubmitDisabled = name.trim().length === 0;

  return (
    <Form action={action} onSuccessState={onSuccess} state={state}>
      <input name="organizationId" type="hidden" value={organizationId} />
      <Label htmlFor={organisationNameId}>Organisation name</Label>
      <Input
        id={organisationNameId}
        name="name"
        onChange={(event) => setName(event.target.value)}
        placeholder="Amazon"
        type="text"
        value={name}
      />
      <FieldError actionState={state} name="name" />
      <DialogFooter>
        <DialogClose asChild>
          <Button type="button" variant="outline">
            Cancel
          </Button>
        </DialogClose>
        <SubmitButton disabled={isSubmitDisabled} label="Update Organisation" />
      </DialogFooter>
    </Form>
  );
};

export { UpdateOrganisationForm };
