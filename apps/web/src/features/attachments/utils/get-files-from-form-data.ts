/**
 * Valibot-free helper to read file entries from FormData.
 * Safe to use in client components (e.g. optimistic UI) without pulling in validation.
 */
export const getFilesFromFormData = (formData: FormData): File[] => {
  const raw = formData.getAll("files");
  if (!raw?.length) {
    return [];
  }
  const files = Array.from(raw) as File[];
  return files.filter((f): f is File => f instanceof File && f.size > 0);
};
