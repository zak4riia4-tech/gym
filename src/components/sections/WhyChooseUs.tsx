import { BadgeCheck, FileX, Gauge, Wrench, type LucideIcon } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { reasons, whySection, type ReasonIcon } from "@/content/site";

const ICONS: Record<ReasonIcon, LucideIcon> = {
  coaches: BadgeCheck,
  contract: FileX,
  equipment: Wrench,
  space: Gauge,
};

/**
 * Two columns, not heading-above-grid.
 *
 * Every other section on this page puts an eyebrow and a heading above a row
 * of things. Doing that seven times in a row is what makes a site read as a
 * template. Here the heading holds the left column and stays put while the
 * reasons scroll past it — same content, completely different rhythm.
 */
export function WhyChooseUs() {
  return (
    <section
      id="why"
      aria-labelledby="why-heading"
      className="scroll-mt-24 bg-void py-24 md:py-32 lg:py-40"
    >
      <Container>
        <div className="grid gap-14 lg:grid-cols-[0.85fr_1.15fr] lg:gap-20">
          {/* Sticky on desktop: the statement stays with you while you read the
              evidence for it. */}
          <Reveal>
            <div className="lg:sticky lg:top-32">
              <p className="font-mono text-[11px] uppercase tracking-[0.24em] text-brass">
                {whySection.eyebrow}
              </p>

              <h2
                id="why-heading"
                className="u-display mt-6 text-[clamp(2.25rem,5.5vw,4rem)] font-extrabold uppercase leading-[0.92] text-chalk"
              >
                {whySection.title}
              </h2>

              <p className="mt-7 max-w-[38ch] text-[16px] leading-relaxed text-ash md:text-[17px]">
                {whySection.description}
              </p>
            </div>
          </Reveal>

          {/* One per row, numbered by nothing — just separated by rules. */}
          <ul className="flex flex-col">
            {reasons.map((reason, index) => {
              const Icon = ICONS[reason.icon];
              return (
                <Reveal key={reason.title} delay={100 + index * 90}>
                  <li className="flex gap-6 border-t border-steel py-8 first:pt-0 sm:gap-8 lg:py-10">
                    <span className="mt-1 inline-flex size-11 shrink-0 items-center justify-center rounded-[2px] border border-steel text-brass transition-colors duration-700 ease-gentle">
                      <Icon aria-hidden="true" className="size-5" />
                    </span>

                    <div>
                      <h3 className="u-display text-[19px] font-extrabold uppercase leading-tight tracking-[0.03em] text-chalk md:text-[21px]">
                        {reason.title}
                      </h3>
                      <p className="mt-3 max-w-[52ch] text-[15px] leading-relaxed text-ash md:text-[16px]">
                        {reason.body}
                      </p>
                    </div>
                  </li>
                </Reveal>
              );
            })}
          </ul>
        </div>
      </Container>
    </section>
  );
}
