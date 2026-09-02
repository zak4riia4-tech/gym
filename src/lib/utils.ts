type ClassValue = string | false | null | undefined;

/**
 * Joins class names and drops anything falsy, so conditional classes
 * can be written inline:  cn("card", isActive && "card-active")
 */
export function cn(...classes: ClassValue[]): string {
  return classes.filter(Boolean).join(" ");
}
