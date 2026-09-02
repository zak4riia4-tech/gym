import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type SectionHeadingProps = {
  eyebrow: string;
  title: ReactNode;
  description?: string;
  /** The surface this heading sits on, not the colour of the text. */
  tone?: "light" | "dark";
  /** Passed to the <h2> so a section can point aria-labelledby at it. */
  id?: string;
  className?: string;
};

export function SectionHeading({
  eyebrow,
  title,
  description,
  tone = "dark",
  id,
  className,
}: SectionHeadingProps) {
  const light = tone === "light";

  return (
    <div className={cn("max-w-xl", className)}>
      <p
        className={cn(
          "font-mono text-[11px] uppercase tracking-[0.22em]",
          light ? "text-bronze" : "text-brass",
        )}
      >
        {eyebrow}
      </p>

      <h2
        id={id}
        className={cn(
          "u-display mt-5 text-[clamp(2rem,5vw,3.5rem)] font-extrabold uppercase leading-[0.95]",
          light ? "text-void" : "text-chalk",
        )}
      >
        {title}
      </h2>

      {description ? (
        <p
          className={cn(
            "mt-6 text-[16px] leading-relaxed md:text-[17px]",
            light ? "text-graphite" : "text-ash",
          )}
        >
          {description}
        </p>
      ) : null}
    </div>
  );
}
