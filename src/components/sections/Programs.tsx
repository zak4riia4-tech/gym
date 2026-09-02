"use client";

import { ProgramCard } from "@/components/programs/ProgramCard";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { programs, programsSection } from "@/content/site";

export function Programs() {
  /**
   * STEP 3 placeholder. A /programs/[id] page can be added later — this
   * function is the only thing that has to change when it is.
   */
  function handleExplore(programId: string) {
    console.info("[programs] explore", { programId });
  }

  return (
    <section
      id="programs"
      aria-labelledby="programs-heading"
      className="bg-void py-24 md:py-32 lg:py-40"
    >
      <Container>
        <Reveal>
          <SectionHeading
            id="programs-heading"
            tone="dark"
            eyebrow={programsSection.eyebrow}
            title={programsSection.title}
            description={programsSection.description}
          />
        </Reveal>

        {/* 1 column on phones, 2 on tablets, 4 on desktop — four items divide
            evenly into all three, so no card is ever left stranded on a row. */}
        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:mt-20 lg:grid-cols-4 lg:gap-6">
          {programs.map((program, index) => (
            <Reveal key={program.id} delay={120 + index * 80} className="h-full">
              <ProgramCard program={program} onExplore={handleExplore} />
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
