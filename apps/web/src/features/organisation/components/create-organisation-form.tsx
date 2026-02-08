"use client";

import { useActionState, useId } from "react";
import { FieldError } from "@/components/form/field-error";
import { Form } from "@/components/form/form";
import { SubmitButton } from "@/components/form/submit-button";
import { Input } from "@/components/ui/input";
import { EMPTY_ACTION_STATE } from "@/utils/to-action-state";
import type { createOrganisation } from "../actions/create-organisation";

const CreateOrganisationForm = ({
  createOrganisationAction,
}: {
  createOrganisationAction: typeof createOrganisation;
}) => {
  const [state, action] = useActionState(
    createOrganisationAction,
    EMPTY_ACTION_STATE,
  );
  const organisationNameId = useId();

  return (
    <Form action={action} state={state}>
      <Input
        defaultValue={state?.payload?.name ?? ""}
        id={organisationNameId}
        name="name"
        placeholder="Amazon"
        type="text"
      />
      <FieldError actionState={state} name="name" />
      <SubmitButton label="Create Organisation" />
    </Form>
  );
};

export { CreateOrganisationForm };
