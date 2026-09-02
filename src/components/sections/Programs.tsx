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
      className="scroll-mt-24 u-ambient bg-void py-16 md:py-28 lg:py-40"
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
        {/* -mx / px pair lets the rail bleed to the screen edges while the
            first card still lines up with the heading above it. */}
        <div className="u-rail -mx-6 mt-14 gap-4 px-6 pb-2 md:-mx-10 md:px-10 lg:mx-0 lg:mt-20 lg:grid-cols-4 lg:gap-6 lg:px-0 lg:pb-0">
          {programs.map((program, index) => (
            <Reveal key={program.id} delay={120 + index * 80} className="h-full w-[78vw] shrink-0 sm:w-[52vw] lg:w-auto">
              <ProgramCard program={program} onExplore={handleExplore} />
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
