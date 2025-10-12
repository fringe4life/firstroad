import { headers } from "node_modules/next/headers";
import { z } from "zod/v4";
import { auth } from "@/lib/auth";
import { inngest } from "@/lib/inngest";

const emailSchema = z.object({ email: z.email() });

export const eventPasswordReset = inngest.createFunction(
  { id: "event-password-reset" },
  { event: "password.reset" },
  async ({ event }) => {
    const result = emailSchema.safeParse(event.data);
    if (!result.success) {
      throw new Error("Invalid email");
    }
    const { email } = result.data;
    await auth.api.requestPasswordReset({
      body: {
        email,
        redirectTo: `${
          // biome-ignore lint/style/noNonNullAssertion: exists
          process.env.NEXT_PUBLIC_APP_URL!
        }/reset-password`,
      },
      headers: await headers(),
    });
  },
);
