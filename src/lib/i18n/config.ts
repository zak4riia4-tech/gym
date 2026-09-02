/**
 * The three languages the site ships in.
 *
 * `ckb` is the ISO code for Central Kurdish (Sorani). It is written in the
 * Arabic script and reads right to left, as does Arabic — English is the only
 * left-to-right locale here, which is why direction is a property of the
 * locale rather than an assumption baked into the layout.
 */
export const locales = ["en", "ckb", "ar"] as const;

export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "en";

export const localeConfig: Record<
  Locale,
  { label: string; englishName: string; dir: "ltr" | "rtl"; htmlLang: string }
> = {
  en: { label: "English", englishName: "English", dir: "ltr", htmlLang: "en" },
  ckb: { label: "کوردی", englishName: "Kurdish Sorani", dir: "rtl", htmlLang: "ckb" },
  ar: { label: "العربية", englishName: "Arabic", dir: "rtl", htmlLang: "ar" },
};

export function isLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value);
}

/** Best match from an Accept-Language header, falling back to English. */
export function matchLocale(acceptLanguage: string | null): Locale {
  if (!acceptLanguage) return defaultLocale;

  const ranked = acceptLanguage
    .split(",")
    .map((part) => {
      const [tag, q] = part.trim().split(";q=");
      return { tag: tag.toLowerCase(), q: q ? Number(q) : 1 };
    })
    .sort((a, b) => b.q - a.q);

  for (const { tag } of ranked) {
    if (tag.startsWith("ckb") || tag.startsWith("ku")) return "ckb";
    if (tag.startsWith("ar")) return "ar";
    if (tag.startsWith("en")) return "en";
  }
  return defaultLocale;
}
