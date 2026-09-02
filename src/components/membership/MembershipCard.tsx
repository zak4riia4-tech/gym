"use client";

import { ArrowRight, Check, Layers } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import { membership, site, type BillingPeriod } from "@/content/site";
import type { MembershipPlanRow } from "@/lib/supabase/types";

/* Fixed locale so the server and the browser format identically. */
const formatIqd = new Intl.NumberFormat("en-US");

type MembershipCardProps = {
  plan: MembershipPlanRow;
  period: BillingPeriod;
  onChoose: (planSlug: string, period: BillingPeriod) => void;
};

/**
 * ONE card component, rendered three times from the plans array.
 * Everything that differs between BASIC / PRO / ELITE comes in as data.
 *
 * The featured plan inverts to a dark card on the bone background — that
 * contrast is what makes it read as "recommended" before a word is read.
 */
export function MembershipCard({ plan, period, onChoose }: MembershipCardProps) {
  const featured = plan.is_recommended;
  const pricePerMonth = period === "yearly" ? plan.yearly_price : plan.monthly_price;
  const priceUsd = Math.round(pricePerMonth / site.currency.usdRate);
  const headingId = `plan-${plan.slug}`;

  return (
    <article
      aria-labelledby={headingId}
      className={cn(
        "group relative flex h-full flex-col overflow-hidden rounded-[2px] p-8 md:p-9",
        "transition-[transform,box-shadow,border-color] duration-700 ease-gentle",
        // hairline that draws across the top edge on hover
        "before:absolute before:inset-x-0 before:top-0 before:h-px before:origin-left before:bg-brass before:transition-transform before:duration-700 before:ease-out-soft before:content-['']",
        featured
          ? cn(
              "border border-white/10 bg-gradient-to-b from-iron to-void text-chalk shadow-featured",
              "before:scale-x-100",
              "lg:-translate-y-3 motion-safe:lg:hover:-translate-y-6",
            )
          : cn(
              "border border-void/10 bg-white text-void shadow-card",
              "before:scale-x-0 hover:before:scale-x-100",
              "hover:border-bronze/40 hover:shadow-card-hover motion-safe:hover:-translate-y-2",
            ),
      )}
    >
      {featured ? (
        <span className="absolute right-8 top-8 rounded-[2px] bg-brass px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.18em] text-void md:right-9">
          Recommended
        </span>
      ) : null}

      {/* --- Plan name + who it is for ----------------------------------- */}
      <h3
        id={headingId}
        className={cn(
          "u-display text-[22px] font-extrabold uppercase tracking-[0.04em]",
          featured ? "text-chalk" : "text-void",
        )}
      >
        {plan.name}
      </h3>

      <p
        className={cn(
          "mt-3 max-w-[34ch] text-[15px] leading-relaxed",
          featured ? "text-ash" : "text-graphite",
        )}
      >
        {plan.description}
      </p>

      {/* --- Price --------------------------------------------------------
          key={period} makes React throw this block away and build a new one
          whenever the billing period changes, which replays the animation. */}
      <div key={period} className="price-block mt-8">
        <div className="flex items-baseline gap-2">
          <span
            className={cn(
              "u-display text-[clamp(2.25rem,4vw,2.75rem)] font-extrabold leading-none",
              featured ? "text-chalk" : "text-void",
            )}
          >
            {formatIqd.format(pricePerMonth)}
          </span>
          <span
            className={cn(
              "font-mono text-[12px] uppercase tracking-[0.16em]",
              featured ? "text-brass" : "text-bronze",
            )}
          >
            {site.currency.code}
          </span>
        </div>

        <p
          className={cn(
            "mt-2.5 font-mono text-[11px] uppercase tracking-[0.16em]",
            featured ? "text-ash" : "text-graphite",
          )}
        >
          {period === "yearly" ? "Per month · billed annually" : "Per month"}
        </p>

        <p
          className={cn(
            "mt-1.5 font-mono text-[11px] tracking-[0.06em]",
            featured ? "text-ash" : "text-graphite",
          )}
        >
          ≈ ${priceUsd} / month
        </p>
      </div>

      {/* --- What is included -------------------------------------------- */}
      <div className={cn("mt-8 border-t pt-7", featured ? "border-white/10" : "border-void/10")}>
        {plan.inherits ? (
          <p
            className={cn(
              "mb-5 flex items-center gap-2.5 font-mono text-[11px] uppercase tracking-[0.16em]",
              featured ? "text-brass" : "text-bronze",
            )}
          >
            <Layers aria-hidden="true" className="size-3.5 shrink-0" />
            Everything in {plan.inherits}
          </p>
        ) : null}

        <ul className="space-y-3.5">
          {plan.features.map((feature) => (
            <li
              key={feature}
              className={cn(
                "flex items-start gap-3 text-[15px] leading-snug",
                featured ? "text-chalk" : "text-void",
              )}
            >
              <Check
                aria-hidden="true"
                className={cn("mt-0.5 size-4 shrink-0", featured ? "text-brass" : "text-bronze")}
              />
              <span>{feature}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* --- CTA ----------------------------------------------------------
          mt-auto pushes this to the bottom so all three buttons line up,
          however long the feature list is. */}
      <div className="mt-auto pt-9">
        <Button
          variant={featured ? "primary" : "outline"}
          tone={featured ? "dark" : "light"}
          className="w-full"
          onClick={() => onChoose(plan.slug, period)}
        >
          {membership.cta}
          {/* Gives each of the three buttons a unique name for screen readers. */}
          <span className="sr-only"> — {plan.name} plan</span>
          <ArrowRight
            aria-hidden="true"
            className="size-4 transition-transform duration-300 ease-out-soft group-hover/btn:translate-x-1"
          />
        </Button>
      </div>
    </article>
  );
}
