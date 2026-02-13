import type { ResourcePermission } from "./types";

const DEFAULT_PERMISSION: ResourcePermission = {
  canCreate: true,
  canUpdate: true,
  canDelete: true,
};

export { DEFAULT_PERMISSION };
