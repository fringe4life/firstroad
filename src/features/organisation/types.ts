import type { auth } from "@/lib/auth";
import type { List, UnsuccessfulState } from "@/types";
import type { ActiveOrganizationId } from "../auth/types";

export type Organisation = typeof auth.$Infer.Organization;

export type Member = typeof auth.$Infer.Member;

export type BaseOrganisation = Organisation & {
  _count: {
    members: number;
  };
  memberShipByUser: Omit<Member, "user">;
};

interface LimitedAccess {
  limitedAccess?: boolean;
}

export interface OrganisationProps extends LimitedAccess {}

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

export interface OrganisationActionButtonProps extends LimitedAccess {
  organizationId: string;
  isActive: boolean;
}

export interface OrganisationMemberRow {
  name: string;
  email: string;
  emailVerified: boolean;
  joinedAt: Date;
}

export interface OrganisationByIdProps {
  members: List<OrganisationMemberRow>;
}
