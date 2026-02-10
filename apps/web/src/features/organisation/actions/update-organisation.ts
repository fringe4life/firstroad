"use server";

import { createSlug } from "@firstroad/utils";
import { headers } from "next/headers";
import { maxLength, minLength, object, pipe, safeParse, string } from "valibot";
import { auth } from "@/lib/auth";
import { setCookieByKey } from "@/utils/cookies";
import {
  type ActionState,
  fromErrorToActionState,
  toActionState,
} from "@/utils/to-action-state";
import { tryCatch } from "@/utils/try-catch";

const updateOrganisationSchema = object({
  name: pipe(string(), minLength(6), maxLength(191)),
  organizationId: pipe(string(), minLength(1)),
});

const updateOrganisation = async (
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> => {
  const payload = Object.fromEntries(formData.entries());
  if (typeof payload.name === "string") {
    payload.name = payload.name.trim();
  }

  const result = safeParse(updateOrganisationSchema, payload);

  if (!result.success) {
    return fromErrorToActionState(result.issues, formData);
  }

  const {
    output: { name, organizationId },
  } = result;
  const { error } = await tryCatch(
    async () =>
      await auth.api.updateOrganization({
        body: {
          organizationId,
          data: {
            name,
            slug: createSlug(name),
          },
        },
        headers: await headers(),
      }),
  );

  if (error) {
    return fromErrorToActionState(error, formData);
  }

  await setCookieByKey("toast", "Organisation updated");
  return toActionState("Organisation updated", "SUCCESS");
};

export { updateOrganisation };
