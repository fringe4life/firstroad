import type { ResourcePermission } from "./types";

// Default flags for item-scoped permissions (per resource instance).
const DEFAULT_ITEM_PERMISSION: Pick<
  ResourcePermission,
  "canUpdate" | "canDelete"
> = {
  canUpdate: false,
  canDelete: false,
};

// Default flag for org-scoped creation permission.
const DEFAULT_CREATE_PERMISSION: Pick<ResourcePermission, "canCreate"> = {
  canCreate: false,
};

export { DEFAULT_CREATE_PERMISSION, DEFAULT_ITEM_PERMISSION };
