import type { ResourceType } from "@/features/memberships/types";
import type { OwnerKind } from "../types";

const toOwnerKind = (resourceType: ResourceType): OwnerKind => {
  return resourceType === "TICKET" ? "ticket" : "comment";
};

export { toOwnerKind };
