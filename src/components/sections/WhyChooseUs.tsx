import { BadgeCheck, FileX, Gauge, Wrench, type LucideIcon } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { reasons, whySection, type ReasonIcon } from "@/content/site";

const ICONS: Record<ReasonIcon, LucideIcon> = {
  coaches: BadgeCheck,
  contract: FileX,
  equipment: Wrench,
  space: Gauge,
};

/**
 * Four reasons, on hairline rules rather than in cards.
 *
 * Deliberately not boxed: the section sits directly under the hero, and a row
 * of four more cards there would compete with the programme cards below it.
 * Rules give the same structure at a fraction of the visual weight.
 */
export function WhyChooseUs() {
  return (
    <section
      id="why"
      aria-labelledby="why-heading"
      className="scroll-mt-24 bg-void py-24 md:py-28 lg:py-32"
    >
      <Container>
        <Reveal>
          <SectionHeading
            id="why-heading"
            tone="dark"
            eyebrow={whySection.eyebrow}
            title={whySection.title}
            description={whySection.description}
          />
        </Reveal>

        <div className="mt-14 grid gap-x-10 gap-y-12 sm:grid-cols-2 lg:mt-20 lg:grid-cols-4">
          {reasons.map((reason, index) => {
            const Icon = ICONS[reason.icon];
            return (
              <Reveal key={reason.title} delay={120 + index * 80}>
                <div className="border-t border-steel pt-7">
                  <span className="inline-flex size-11 items-center justify-center rounded-[2px] border border-steel text-brass">
                    <Icon aria-hidden="true" className="size-5" />
                  </span>

                  <h3 className="u-display mt-6 text-[17px] font-extrabold uppercase leading-tight tracking-[0.03em] text-chalk">
                    {reason.title}
                  </h3>

                  <p className="mt-3 text-[15px] leading-relaxed text-ash">{reason.body}</p>
                </div>
              </Reveal>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
