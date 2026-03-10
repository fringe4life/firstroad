import type { Maybe } from "@/types";

/** Normalize deadline to yyyy-MM-dd string for DatePicker (accepts string only). */
const toDeadlineString = (
  value: Maybe<string | Date>,
): Exclude<Maybe<string>, null> => {
  if (value == null) {
    return undefined;
  }
  if (typeof value === "string") {
    return value.slice(0, 10);
  }
  return value.toISOString().slice(0, 10);
};

export { toDeadlineString };
