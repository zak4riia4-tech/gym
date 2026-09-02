"use client";

import { ArrowRight, Dumbbell, Flame, Move, TrendingUp, type LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Ledger } from "@/components/ui/Ledger";
import { programsSection, type Program, type ProgramIcon } from "@/content/site";

/* The data file stores an icon KEY ("dumbbell"). This map turns that key into
   a real component. TypeScript's Record forces every key to have an icon, so
   a typo in site.ts fails the build instead of rendering nothing. */
const PROGRAM_ICONS: Record<ProgramIcon, LucideIcon> = {
  dumbbell: Dumbbell,
  flame: Flame,
  growth: TrendingUp,
  movement: Move,
};

type ProgramCardProps = {
  program: Program;
  onExplore: (programId: string) => void;
};

export function ProgramCard({ program, onExplore }: ProgramCardProps) {
  const Icon = PROGRAM_ICONS[program.icon];
  const headingId = `program-${program.id}`;

  return (
    <article
      aria-labelledby={headingId}
      className={[
        "group relative flex h-full flex-col rounded-[2px] border border-steel bg-iron p-7",
        "transition-[transform,border-color,background-color] duration-500 ease-out-soft",
        "hover:border-brass/40 hover:bg-[#161a1f] motion-safe:hover:-translate-y-1.5",
        // the brass hairline that draws across the top — same motif as the plan cards
        "before:absolute before:inset-x-0 before:top-0 before:h-px before:origin-left before:scale-x-0",
        "before:bg-brass before:transition-transform before:duration-500 before:ease-out-soft",
        "before:content-[''] hover:before:scale-x-100",
      ].join(" ")}
    >
      <span
        className={[
          "inline-flex size-12 items-center justify-center rounded-[2px] border border-steel text-brass",
          "transition-[border-color,background-color] duration-500 ease-out-soft",
          "group-hover:border-brass/50 group-hover:bg-brass/10",
        ].join(" ")}
      >
        <Icon aria-hidden="true" className="size-5" />
      </span>

      <h3
        id={headingId}
        className="u-display mt-6 text-[19px] font-extrabold uppercase tracking-[0.03em] text-chalk"
      >
        {program.name}
      </h3>

      <p className="mt-3 text-[15px] leading-relaxed text-ash">{program.description}</p>

      {/* Difficulty and duration as a spec sheet, not a sentence.
          mt-auto pins this block to the bottom of the card, so the spec sheets
          and the CTAs line up across all four cards even though the titles and
          descriptions run to different lengths. */}
      <div className="mt-auto pt-6">
        <Ledger
          items={[
            { label: "Difficulty", value: program.difficulty },
            { label: "Duration", value: program.duration },
          ]}
        />

        <Button
          className="mt-6"
          variant="link"
          tone="dark"
          onClick={() => onExplore(program.id)}
        >
          {programsSection.cta}
          <span className="sr-only"> — {program.name}</span>
          <ArrowRight
            aria-hidden="true"
            className="size-4 transition-transform duration-300 ease-out-soft group-hover/btn:translate-x-1"
          />
        </Button>
      </div>
    </article>
  );
}
