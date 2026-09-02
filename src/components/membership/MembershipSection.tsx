"use client";

import { useCallback, useState } from "react";
import { BookingModal } from "@/components/booking/BookingModal";
import { BillingToggle } from "@/components/membership/BillingToggle";
import { MembershipCard } from "@/components/membership/MembershipCard";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { membership, YEARLY_SAVING_PERCENT, type BillingPeriod, type PlanId } from "@/content/site";
import type { MembershipPlanRow } from "@/lib/supabase/types";

/**
 * The Membership section owns ONE piece of state: the billing period.
 *
 * It flows DOWN as a prop to the toggle and to all three cards, and changes
 * flow back UP through onChange. That single source of truth is why the
 * prices, the "billed annually" line and the Save badge can never disagree
 * with each other — and why nothing here needs a page reload.
 */
export function MembershipSection({ plans }: { plans: MembershipPlanRow[] }) {
  const [period, setPeriod] = useState<BillingPeriod>("monthly");

  /** Which plan the booking dialog opens with. "" means the dialog is closed. */
  const [bookingPlan, setBookingPlan] = useState<PlanId | "">("");

  function handleChoosePlan(planId: PlanId) {
    setBookingPlan(planId);
  }

  /* useCallback keeps this reference stable, so the dialog does not tear down
     and re-attach its close listener on every render. */
  const closeBooking = useCallback(() => setBookingPlan(""), []);

  return (
    <section
      id="membership"
      aria-labelledby="membership-heading"
      className="bg-chalk py-24 md:py-32 lg:py-40"
    >
      <Container>
        {/* Heading left, toggle right — the asymmetric layout from the
            design system, instead of centring everything. Stacks on mobile. */}
        <div className="flex flex-col gap-10 lg:flex-row lg:items-end lg:justify-between lg:gap-16">
          <Reveal>
            <SectionHeading
              id="membership-heading"
              tone="light"
              eyebrow={membership.eyebrow}
              title={membership.title}
              description={membership.description}
            />
          </Reveal>

          <Reveal delay={120} className="lg:pb-2">
            <BillingToggle
              value={period}
              onChange={setPeriod}
              savingPercent={YEARLY_SAVING_PERCENT}
            />
          </Reveal>
        </div>

        {/* One column on mobile and tablet, three from lg up. */}
        <div className="mt-14 grid gap-6 md:mx-auto md:max-w-md lg:mt-20 lg:max-w-none lg:grid-cols-3 lg:gap-8">
          {plans.map((plan, index) => (
            <Reveal key={plan.id} delay={180 + index * 90} className="h-full">
              <MembershipCard plan={plan} period={period} onChoose={handleChoosePlan} />
            </Reveal>
          ))}
        </div>

        <Reveal delay={460}>
          <p className="mt-12 max-w-2xl font-mono text-[11px] leading-relaxed tracking-[0.04em] text-graphite lg:mt-16">
            {membership.footnote}
          </p>
        </Reveal>
      </Container>

      <BookingModal
        open={bookingPlan !== ""}
        planId={bookingPlan}
        plans={plans}
        onClose={closeBooking}
      />
    </section>
  );
}
