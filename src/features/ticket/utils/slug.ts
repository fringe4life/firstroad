import slugify from "slugify";

/**
 * Converts a title string to a URL-friendly slug
 *
 * @param title - The title to convert to a slug
 * @returns A URL-friendly slug
 *
 * @example
 * createSlug("This    Ticket Title    Should") // "this-ticket-title-should"
 * createSlug("Toggle Dark Theme") // "toggle-dark-theme"
 * createSlug("Fix Bug #123") // "fix-bug-123"
 */
export const createSlug = (title: string): string =>
  slugify(title, {
    lower: true,
    strict: true,
    trim: true,
  });

/**
 * Ensures a slug is unique by appending a number if necessary
 *
 * @param baseSlug - The base slug to make unique
 * @param existingSlugs - Array of existing slugs to check against
 * @returns A unique slug
 *
 * @example
 * ensureUniqueSlug("my-ticket", ["my-ticket", "my-ticket-1"]) // "my-ticket-2"
 */
export const ensureUniqueSlug = (
  baseSlug: string,
  existingSlugs: string[],
): string => {
  if (!existingSlugs.includes(baseSlug)) {
    return baseSlug;
  }

  let counter = 1;
  let uniqueSlug = `${baseSlug}-${counter}`;

  while (existingSlugs.includes(uniqueSlug)) {
    counter += 1;
    uniqueSlug = `${baseSlug}-${counter}`;
  }

  return uniqueSlug;
};
