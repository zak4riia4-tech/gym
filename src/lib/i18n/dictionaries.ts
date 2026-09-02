import { en } from "@/content/i18n/en";
import { ckb } from "@/content/i18n/ckb";
import { ar } from "@/content/i18n/ar";
import type { Locale } from "./config";
import type { Dictionary } from "@/content/i18n/en";

const dictionaries: Record<Locale, Dictionary> = { en, ckb, ar };

/**
 * All three dictionaries are imported statically rather than loaded on demand.
 * They are a few kilobytes of text each, and a dynamic import here would make
 * every server render wait on a module resolution for no measurable gain.
 */
export function getDictionary(locale: Locale): Dictionary {
  return dictionaries[locale];
}

export type { Dictionary };
