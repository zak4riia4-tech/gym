"use client";

import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { TrainerCard } from "@/components/trainers/TrainerCard";
import { trainersSection } from "@/content/site";
import type { TrainerRow } from "@/lib/supabase/types";

export function TrainersSection({ trainers }: { trainers: TrainerRow[] }) {
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
      className="scroll-mt-24 u-ambient bg-void py-24 md:py-32 lg:py-40"
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

        <div className="mt-14 grid gap-10 sm:grid-cols-2 sm:gap-8 lg:mt-20 lg:grid-cols-4">
          {trainers.map((trainer, index) => (
            <Reveal key={trainer.id} delay={120 + index * 80} className="h-full">
              <TrainerCard trainer={trainer} onViewProfile={handleViewProfile} />
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
