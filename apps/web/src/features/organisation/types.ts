import type { MemberModel } from "@firstroad/db/client-types";
import type { ActiveOrganizationId } from "@/features/auth/types";
import type { auth } from "@/lib/auth";
import type { List, UnsuccessfulState } from "@/types";

export type Organisation = typeof auth.$Infer.Organization;

export type Member = typeof auth.$Infer.Member;

// Role type that works with both Prisma and Better Auth
type MemberRole = MemberModel["role"] | (typeof auth.$Infer.Member)["role"];

export interface OrganisationId extends Pick<Member, "organizationId"> {}

// Interface for objects that have a role property (admin/owner checkable)
// Accepts string to work with Better Auth hooks that type role as string
// The utility function will handle runtime string comparison
export interface AdminVerifiable {
  role?: MemberRole | string | null;
}

export type BaseOrganisation = Organisation & {
  _count: {
    members: number;
  };
  memberShipByUser: Omit<Member, "user">;
};

interface LimitedAccess {
  limitedAccess?: boolean;
}

export interface OrganisationProps extends LimitedAccess {
  organisations?: List<BaseOrganisation>;
}

export interface OrganisationListProps
  extends UnsuccessfulState,
    ActiveOrganizationId,
    LimitedAccess {
  organisations: List<BaseOrganisation>;
}

export interface OrganisationItemProps
  extends ActiveOrganizationId,
    LimitedAccess {
  organisation: BaseOrganisation;
}

export interface OrganisationActionButtonProps
  extends OrganisationId,
    LimitedAccess {
  organizationName: string;
  isActive: boolean;
  isAdminOrOwner: boolean;
}

export interface SwitchOrgButtonProps extends OrganisationId {
  isActive: boolean;
}
