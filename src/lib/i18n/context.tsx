"use client";

import { createContext, useContext, type ReactNode } from "react";
import type { Locale } from "./config";
import type { Dictionary } from "@/content/i18n/en";

type I18nValue = { locale: Locale; dir: "ltr" | "rtl"; dict: Dictionary };

const I18nContext = createContext<I18nValue | null>(null);

/**
 * Server components read the dictionary directly with getDictionary(). Client
 * components cannot, so the server passes it down once through this provider
 * rather than every component threading it through props.
 */
export function I18nProvider({ value, children }: { value: I18nValue; children: ReactNode }) {
  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n(): I18nValue {
  const value = useContext(I18nContext);
  if (!value) {
    throw new Error("useI18n must be used inside <I18nProvider>. Wrap the page in it.");
  }
  return value;
}
