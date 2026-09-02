import { headers } from "next/headers";
import { defaultLocale, isLocale, localeConfig, type Locale } from "./config";
import { getDictionary, type Dictionary } from "./dictionaries";

/**
 * The server-side counterpart to useI18n().
 *
 * Server components cannot read React context, so rather than threading the
 * dictionary through props on every section they read it from the request
 * header the proxy sets. Same source of truth, no prop drilling.
 */
export async function getServerI18n(): Promise<{
  locale: Locale;
  dir: "ltr" | "rtl";
  dict: Dictionary;
}> {
  const raw = (await headers()).get("x-locale");
  const locale = raw && isLocale(raw) ? raw : defaultLocale;
  return { locale, dir: localeConfig[locale].dir, dict: getDictionary(locale) };
}
