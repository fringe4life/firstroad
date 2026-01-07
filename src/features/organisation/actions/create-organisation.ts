"use server";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { maxLength, minLength, object, pipe, safeParse, string } from "valibot";
import { auth } from "@/lib/auth";
import { ticketsPath } from "@/path";
import { setCookieByKey } from "@/utils/cookies";
import { createSlug } from "@/utils/slug";
import {
  type ActionState,
  fromErrorToActionState,
} from "@/utils/to-action-state";
import { tryCatch } from "@/utils/try-catch";

const createOrganisationSchema = object({
  name: pipe(string(), minLength(6), maxLength(191)),
});

const createOrganisation = async (
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> => {
  const result = safeParse(
    createOrganisationSchema,
    Object.fromEntries(formData.entries()),
  );

  if (!result.success) {
    return fromErrorToActionState(result.issues, formData);
  }

  const {
    output: { name },
  } = result;
  const { error } = await tryCatch(
    async () =>
      await auth.api.createOrganization({
        body: {
          name, // required
          slug: createSlug(name), // required
          keepCurrentActiveOrganization: false,
        },
        // This endpoint requires session cookies.
        headers: await headers(),
      }),
  );

  if (error) {
    return fromErrorToActionState(error, formData);
  }

  setCookieByKey("toast", "Organisation created");
  throw redirect(ticketsPath());
};

export { createOrganisation };
