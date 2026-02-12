"use server";

import { createSlug } from "@firstroad/utils";
import { refresh } from "next/cache";
import { headers } from "next/headers";
import {
  maxLength,
  minLength,
  object,
  pipe,
  safeParse,
  string,
  trim,
} from "valibot";
import { getUserOrRedirect } from "@/features/auth/queries/get-user-or-redirect";
import { auth } from "@/lib/auth";
import { setCookieByKey } from "@/utils/cookies";
import { invalidateOrganisationsForUser } from "@/utils/invalidate-cache";
import {
  type ActionState,
  fromErrorToActionState,
  toActionState,
} from "@/utils/to-action-state";
import { tryCatch } from "@/utils/try-catch";

const updateOrganisationSchema = object({
  name: pipe(string(), minLength(6), maxLength(191)),
  organizationId: pipe(string(), trim(), minLength(1)),
});

const updateOrganisation = async (
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> => {
  const payload = Object.fromEntries(formData.entries());

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

  const user = await getUserOrRedirect({ checkOrganistation: false });
  if (user?.id) {
    invalidateOrganisationsForUser(user.id);
  }
  refresh();

  await setCookieByKey("toast", "Organisation updated");
  return toActionState("Organisation updated", "SUCCESS");
};

export { updateOrganisation };
