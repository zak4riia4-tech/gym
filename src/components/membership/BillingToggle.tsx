"use client";

import { cn } from "@/lib/utils";
import { useI18n } from "@/lib/i18n/context";
import type { BillingPeriod } from "@/content/site";

type BillingToggleProps = {
  value: BillingPeriod;
  onChange: (value: BillingPeriod) => void;
  savingPercent: number;
};

/**
 * Monthly / Yearly switch.
 *
 * Built from two real radio inputs inside a fieldset, then styled to look
 * like a segmented control. That is deliberate: real radios give us keyboard
 * arrow-key navigation, screen-reader announcements and form semantics for
 * free. The sliding pill is a separate, decorative element.
 */
export function BillingToggle({ value, onChange, savingPercent }: BillingToggleProps) {
  const { dict, dir } = useI18n();
  const t = dict.membership;
  const OPTIONS: ReadonlyArray<{ value: BillingPeriod; label: string }> = [
    { value: "monthly", label: t.monthly },
    { value: "yearly", label: t.yearly },
  ];
  const isYearly = value === "yearly";

  return (
    <div className="flex flex-wrap items-center gap-x-4 gap-y-3">
      <fieldset className="min-w-0">
        <legend className="sr-only">{t.billingPeriod}</legend>

        <div className="relative flex items-center rounded-[2px] border border-void/15 bg-white p-1 shadow-card">
          {/* The pill that slides behind the selected label. */}
          <span
            aria-hidden="true"
            /* The second option sits to the right in LTR and to the left in RTL,
                   so the pill has to travel the other way. */
            style={{
              transform: isYearly
                ? `translateX(${dir === "rtl" ? "-100%" : "100%"})`
                : "translateX(0)",
            }}
            className={cn(
              "pointer-events-none absolute inset-y-1 start-1 w-[calc(50%-0.25rem)] rounded-[2px] bg-void",
              "transition-transform duration-[420ms] ease-out-soft motion-reduce:transition-none",
            )}
          />

          {OPTIONS.map((option) => (
            <label key={option.value} className="relative z-10 flex-1 cursor-pointer">
              <input
                type="radio"
                name="billing-period"
                value={option.value}
                checked={value === option.value}
                onChange={() => onChange(option.value)}
                className="peer sr-only"
              />
              <span
                className={cn(
                  "block whitespace-nowrap rounded-[2px] px-6 py-2.5 text-center",
                  "font-mono text-[12px] uppercase tracking-[0.16em]",
                  "text-graphite transition-colors duration-300 ease-out-soft peer-checked:text-chalk",
                  "peer-focus-visible:outline-2 peer-focus-visible:outline-offset-[3px] peer-focus-visible:outline-bronze",
                )}
              >
                {option.label}
              </span>
            </label>
          ))}
        </div>
      </fieldset>

      {/* min-w reserves the badge's space so the toggle does not jump sideways
          when the badge appears. aria-live announces the saving to a screen reader. */}
      <p aria-live="polite" className="flex min-h-6 min-w-[104px] items-center">
        {isYearly ? (
          <span className="save-badge inline-flex items-center rounded-[2px] bg-bronze px-2.5 py-1 font-mono text-[11px] uppercase tracking-[0.16em] text-chalk">
            {t.save} {savingPercent}%
          </span>
        ) : null}
      </p>
    </div>
  );
}
