"use server";

import { headers } from "next/headers";
import { minLength, object, pipe, safeParse, string } from "valibot";
import { auth } from "@/lib/auth";
import {
  type ActionState,
  fromErrorToActionState,
  toActionState,
} from "@/utils/to-action-state";
import { tryCatch } from "@/utils/try-catch";

const setActiveOrganisationSchema = object({
  organizationId: pipe(string(), minLength(1)),
});

const setActiveOrganisation = async (
  organizationId: string,
  _prevState: ActionState<string>,
): Promise<ActionState<string>> => {
  const result = safeParse(setActiveOrganisationSchema, { organizationId });

  if (!result.success) {
    return fromErrorToActionState(result.issues);
  }

  const { error } = await tryCatch(async () =>
    auth.api.setActiveOrganization({
      body: { organizationId: result.output.organizationId },
      headers: await headers(),
    }),
  );

  if (error) {
    return fromErrorToActionState(error);
  }

  return toActionState(
    "Organisation switched",
    "SUCCESS",
    undefined,
    organizationId,
  );
};

export { setActiveOrganisation };
