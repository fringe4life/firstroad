import type { auth } from "@/lib/auth";

export type Organisation = typeof auth.$Infer.Organization;

export type Member = typeof auth.$Infer.Member;

export type BaseOrganisation = Organisation & {
  _count: {
    members: number;
  };
  memberShipByUser: Omit<Member, "user">;
};
