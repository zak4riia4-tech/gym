"use client";

import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { TrainerCard } from "@/components/trainers/TrainerCard";
import { useI18n } from "@/lib/i18n/context";
import type { TrainerRow } from "@/lib/supabase/types";

export function TrainersSection({ trainers }: { trainers: TrainerRow[] }) {
  const { dict } = useI18n();
  const trainersSection = dict.trainers;
  /**
   * STEP 3 placeholder. Every trainer already carries a `slug`, so a future
   * /trainers/[slug] page needs nothing more than a router push here.
   */
  function handleViewProfile(trainerId: string) {
    console.info("[trainers] view profile", { trainerId });
  }

  return (
    <section
      id="trainers"
      aria-labelledby="trainers-heading"
      className="scroll-mt-24 u-ambient bg-void py-16 md:py-28 lg:py-40"
    >
      <Container>
        <Reveal>
          <SectionHeading
            id="trainers-heading"
            tone="dark"
            eyebrow={trainersSection.eyebrow}
            title={trainersSection.title}
            description={trainersSection.description}
          />
        </Reveal>

        <div className="u-rail -mx-6 mt-14 gap-5 px-6 pb-2 md:-mx-10 md:px-10 lg:mx-0 lg:mt-20 lg:grid-cols-4 lg:gap-8 lg:px-0 lg:pb-0">
          {trainers.map((trainer, index) => (
            <Reveal key={trainer.id} delay={120 + index * 80} className="h-full w-[72vw] shrink-0 sm:w-[46vw] lg:w-auto">
              <TrainerCard trainer={trainer} onViewProfile={handleViewProfile} />
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
