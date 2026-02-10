import slugify from "slugify";

/**
 * Converts a title string to a URL-friendly slug.
 *
 * @param title - The title to convert to a slug
 * @returns A URL-friendly slug
 *
 * @example
 * createSlug("This    Ticket Title    Should") // "this-ticket-title-should"
 * createSlug("Toggle Dark Theme") // "toggle-dark-theme"
 * createSlug("Fix Bug #123") // "fix-bug-123"
 */
const createSlug = (title: string): string =>
  slugify(title, {
    lower: true,
    strict: true,
    trim: true,
  });

export { createSlug };
