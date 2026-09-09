import { orm } from "@firstroad/db";
import type { MemberModel } from "@firstroad/db/client-types";
import { getUserOrRedirect } from "@/features/auth/queries/get-user-or-redirect";
import type { Maybe } from "@/types";
import { tryCatch } from "@/utils/try-catch";

const getMemberRole = async (
  organizationId: string,
  userId?: string,
): Promise<Maybe<MemberModel["role"]>> => {
  const id = userId ?? (await getUserOrRedirect()).id;

  const { data: member } = await tryCatch(() =>
    orm.Member.where({
      organizationId,
      userId: id,
    })
      .select("role")
      .first(),
  );

  return member?.role;
};

export { getMemberRole };
