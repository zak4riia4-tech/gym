"use client";

import { useState } from "react";
import { Languages } from "lucide-react";
import { TextAreaField, TextField } from "@/components/ui/Field";
import { localeConfig, locales, type Locale } from "@/lib/i18n/config";
import { cn } from "@/lib/utils";

/** The languages that need a translation — English is the base row itself. */
const TRANSLATABLE = locales.filter((l) => l !== "en") as Exclude<Locale, "en">[];

export type TranslationDraft = Record<string, Record<string, string>>;

type FieldSpec = {
  key: string;
  label: string;
  /** textarea instead of a single line */
  long?: boolean;
  /** newline-separated list, stored as an array */
  list?: boolean;
};

/**
 * Per-language overrides for one row.
 *
 * Tabs rather than every language stacked: three copies of six fields down one
 * form is unreadable, and most of the time the owner is editing one language.
 *
 * Anything left blank falls back to the English column on the public site, so a
 * half-finished translation degrades to English rather than to nothing.
 */
export function TranslationFields({
  idPrefix,
  fields,
  value,
  disabled,
  onChange,
}: {
  idPrefix: string;
  fields: FieldSpec[];
  value: TranslationDraft;
  disabled?: boolean;
  onChange: (next: TranslationDraft) => void;
}) {
  const [active, setActive] = useState<Exclude<Locale, "en">>(TRANSLATABLE[0]);

  function set(locale: string, key: string, next: string) {
    onChange({ ...value, [locale]: { ...(value[locale] ?? {}), [key]: next } });
  }

  const filled = (locale: string) =>
    Object.values(value[locale] ?? {}).filter((v) => v.trim() !== "").length;

  return (
    <div className="mt-8 border-t border-steel pt-6">
      <div className="flex flex-wrap items-center gap-3">
        <p className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.18em] text-ash">
          <Languages aria-hidden="true" className="size-3.5" />
          Translations
        </p>

        <div role="tablist" aria-label="Translation language" className="flex gap-1">
          {TRANSLATABLE.map((locale) => (
            <button
              key={locale}
              type="button"
              role="tab"
              aria-selected={active === locale}
              onClick={() => setActive(locale)}
              className={cn(
                "inline-flex min-h-9 items-center gap-2 rounded-[2px] border px-3",
                "font-mono text-[11px] uppercase tracking-[0.14em] transition-colors duration-200",
                "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ember",
                active === locale
                  ? "border-brass bg-brass/12 text-brass"
                  : "border-steel text-ash hover:border-ash hover:text-chalk",
              )}
            >
              {localeConfig[locale].englishName}
              <span className="text-[10px] opacity-70">{filled(locale)}/{fields.length}</span>
            </button>
          ))}
        </div>
      </div>

      <p className="mt-3 text-[13px] leading-relaxed text-ash">
        Leave a field empty and the English version is shown instead. Nothing here
        can break the public page.
      </p>

      <div
        role="tabpanel"
        // The inputs hold Kurdish or Arabic, so the field itself reads
        // right-to-left even though the dashboard around it does not.
        dir={localeConfig[active].dir}
        className="mt-5 grid gap-5 sm:grid-cols-2"
      >
        {fields.map((field) => {
          const id = `${idPrefix}-${active}-${field.key}`;
          const current = value[active]?.[field.key] ?? "";
          const shared = {
            id,
            label: `${field.label} — ${localeConfig[active].englishName}`,
            optionalLabel: "Optional",
            optional: true,
            value: current,
            disabled,
            onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
              set(active, field.key, e.target.value),
          };

          if (field.long || field.list) {
            return (
              <TextAreaField
                key={id}
                {...shared}
                rows={field.list ? 4 : 3}
                className="sm:col-span-2"
              />
            );
          }
          return <TextField key={id} {...shared} />;
        })}
      </div>
    </div>
  );
}
