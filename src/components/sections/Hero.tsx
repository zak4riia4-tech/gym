import Image from "next/image";
import { ArrowDown } from "lucide-react";
import { Ledger } from "@/components/ui/Ledger";
import { getActiveTrainers } from "@/lib/content/public-content";
import { hero, programs, seo } from "@/content/site";

/**
 * The opening statement.
 *
 * Asymmetric on purpose: the headline holds the left, the photograph runs off
 * the right edge. A centred hero with the image behind the text is the shape
 * every gym template uses — this one keeps the type and the image out of each
 * other's way, so both can be read.
 */
export async function Hero() {
  const trainers = await getActiveTrainers();

  return (
    <section
      aria-labelledby="hero-heading"
      className="relative isolate overflow-hidden bg-void pt-28 lg:pt-0"
    >
      <div className="mx-auto grid w-full max-w-[1280px] items-center gap-12 px-6 pb-20 md:px-10 lg:min-h-[92dvh] lg:grid-cols-[1.05fr_0.95fr] lg:gap-16 lg:px-12 lg:pb-0">
        {/* ---------------- Left: the statement ---------------- */}
        <div className="lg:py-28">
          <p className="hero-in font-mono text-[11px] uppercase tracking-[0.24em] text-brass" style={{ animationDelay: "80ms" }}>
            {hero.eyebrow}
          </p>

          <h1
            id="hero-heading"
            className="u-display mt-7 text-[clamp(2.6rem,8.5vw,5.2rem)] font-extrabold uppercase leading-[0.92] text-chalk"
          >
            {/* Each line masks its own reveal, so the headline assembles itself
                rather than fading in as one block. */}
            {hero.headline.map((line, i) => (
              <span key={line} className="block overflow-hidden">
                <span className="hero-line block" style={{ animationDelay: `${180 + i * 110}ms` }}>
                  {/* The trailing space matters: without it a screen reader
                      runs the lines together as "Strengthis a habit,not a mood." */}
                  {line}
                  {i < hero.headline.length - 1 ? " " : ""}
                </span>
              </span>
            ))}
          </h1>

          <p
            className="hero-in mt-8 max-w-[46ch] text-[16px] leading-relaxed text-ash md:text-[17px]"
            style={{ animationDelay: "560ms" }}
          >
            {hero.description}
          </p>

          <div className="hero-in mt-10 flex flex-col gap-3 sm:flex-row" style={{ animationDelay: "660ms" }}>
            <a
              href="#membership"
              className="inline-flex min-h-13 items-center justify-center gap-2.5 rounded-[2px] bg-brass px-7 font-mono text-[12px] uppercase tracking-[0.16em] text-void transition-[background-color,box-shadow,transform] duration-500 ease-gentle hover:bg-ember hover:shadow-brass motion-safe:hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-[3px] focus-visible:outline-ember"
            >
              {hero.primaryCta}
            </a>

            <a
              href="#membership"
              className="inline-flex min-h-13 items-center justify-center gap-2.5 rounded-[2px] border border-chalk/25 px-7 font-mono text-[12px] uppercase tracking-[0.16em] text-chalk transition-[background-color,border-color,color,transform] duration-500 ease-gentle hover:border-chalk hover:bg-chalk hover:text-void motion-safe:hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-[3px] focus-visible:outline-ember"
            >
              {hero.secondaryCta}
            </a>
          </div>

          {/* The ledger motif, opening the site as it will close every card.
              Counted from real data — nothing invented. */}
          <div className="hero-in mt-14 max-w-sm" style={{ animationDelay: "780ms" }}>
            <Ledger
              items={[
                { label: "Programmes", value: String(programs.length) },
                { label: "Coaches", value: String(trainers.length) },
                { label: "Open", value: seo.business.openingHours.replace("Mo-Sa ", "") },
              ]}
            />
          </div>
        </div>

        {/* ---------------- Right: the floor ---------------- */}
        <div className="hero-media relative lg:h-[92dvh]">
          <div className="relative aspect-4/5 w-full overflow-hidden rounded-[2px] lg:absolute lg:inset-y-0 lg:aspect-auto lg:h-full lg:w-[52vw] lg:rounded-none">
            <Image
              src={hero.image}
              alt={hero.imageAlt}
              fill
              // The largest thing on the screen and the LCP element, so it is
              // fetched immediately rather than lazily like everything else.
              priority
              sizes="(min-width: 1024px) 52vw, 100vw"
              className="object-cover"
            />

            {/* Grades the photograph into the page instead of letting it sit in
                a hard-edged box. */}
            <div
              aria-hidden="true"
              className="absolute inset-0 bg-gradient-to-r from-void via-void/25 to-transparent lg:from-void lg:via-void/35"
            />
            <div
              aria-hidden="true"
              className="absolute inset-0 bg-gradient-to-t from-void via-transparent to-void/40"
            />
          </div>
        </div>
      </div>

      {/* Scroll cue, desktop only — on mobile the next section is already visible. */}
      <div className="pointer-events-none absolute inset-x-0 bottom-8 hidden justify-center lg:flex">
        <span className="hero-in flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.22em] text-ash" style={{ animationDelay: "1000ms" }}>
          <ArrowDown aria-hidden="true" className="size-3.5 motion-safe:animate-hero-nudge" />
          {hero.scrollHint}
        </span>
      </div>
    </section>
  );
}
