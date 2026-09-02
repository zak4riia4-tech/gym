/** "personal-trainer" -> "Personal trainer". Used where only a slug is stored. */
export function titleCaseSlug(slug: string): string {
  const words = slug.replace(/[-_]+/g, " ").trim();
  return words.charAt(0).toUpperCase() + words.slice(1);
}

/** "Aram Karim" -> "aram-karim". Suggests a slug from a plan name. */
export function toSlug(value: string): string {
  return value
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
}
