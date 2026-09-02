"use client";

import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { SocialIcon, SOCIAL_LABELS } from "@/components/ui/SocialIcon";
import { Ledger } from "@/components/ui/Ledger";
import { site, trainersSection } from "@/content/site";
import type { TrainerRow } from "@/lib/supabase/types";

type TrainerCardProps = {
  trainer: TrainerRow;
  onViewProfile: (trainerId: string) => void;
};

export function TrainerCard({ trainer, onViewProfile }: TrainerCardProps) {
  const headingId = `trainer-${trainer.id}`;

  /* Socials are two nullable columns now, so build the list from whatever the
     owner actually filled in. A trainer with no links simply shows none. */
  const socials = [
    trainer.instagram_url ? { platform: "instagram" as const, href: trainer.instagram_url } : null,
    trainer.facebook_url ? { platform: "facebook" as const, href: trainer.facebook_url } : null,
  ].filter((link) => link !== null);

  /* Spec-sheet rows, skipping anything the owner left blank. */
  const ledgerItems = [
    trainer.experience ? { label: "Experience", value: trainer.experience } : null,
    trainer.certification ? { label: "Certified", value: trainer.certification } : null,
  ].filter((item) => item !== null);

  return (
    <article aria-labelledby={headingId} className="group relative flex h-full flex-col">
      {/* --- Photo ---------------------------------------------------------
          The gradient behind the image means a slow or failed photo shows a
          designed dark panel instead of a broken box. */}
      <div className="relative aspect-3/4 w-full overflow-hidden rounded-[2px] bg-gradient-to-b from-iron to-void">
        {/* No photo yet? The gradient panel stands in, rather than a broken box. */}
        {trainer.image_url ? (
        <Image
          src={trainer.image_url ?? ""}
          alt={`${trainer.full_name}, ${trainer.specialty.toLowerCase()} at ${site.brand.name}`}
          fill
          sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
          className={[
            "object-cover",
            // Desaturated by default so four different photos read as one set,
            // then full colour on hover. Also a slow, small zoom.
            "grayscale-[60%] contrast-[1.04] transition-[filter,transform] duration-[1100ms] ease-gentle",
            "group-hover:grayscale-0 motion-safe:group-hover:scale-[1.05]",
          ].join(" ")}
        />
        ) : null}
        {/* Keeps the bottom of every photo dark enough to sit under the text. */}
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-t from-void/70 via-transparent to-transparent"
        />
      </div>

      {/* --- Details ------------------------------------------------------ */}
      <p className="mt-6 font-mono text-[11px] uppercase tracking-[0.18em] text-brass">
        {trainer.specialty}
      </p>

      <h3
        id={headingId}
        className="u-display mt-2.5 text-[20px] font-extrabold uppercase tracking-[0.03em] text-chalk"
      >
        {trainer.full_name}
      </h3>

      <p className="mt-3 text-[15px] leading-relaxed text-ash">{trainer.bio}</p>

      {/* mt-auto pins the spec sheet and the links to the bottom, so they line
          up across all four cards however long each bio runs. */}
      <div className="mt-auto pt-6">
        {ledgerItems.length > 0 ? <Ledger items={ledgerItems} /> : null}

        {/* --- Socials + profile link --------------------------------------- */}
        <div className="flex items-center justify-between gap-4 pt-6">
          {/* z-20 lifts these above the stretched profile link below, so each
              social link stays independently clickable. */}
          <ul className="relative z-20 flex items-center gap-1">
            {socials.map((social) => (
              <li key={social.platform}>
                <a
                  href={social.href}
                  aria-label={`${trainer.full_name} on ${SOCIAL_LABELS[social.platform]}`}
                  className={[
                    "inline-flex size-9 items-center justify-center rounded-[2px] text-ash",
                    "transition-colors duration-300 ease-out-soft hover:bg-white/5 hover:text-brass",
                    "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ember",
                  ].join(" ")}
                >
                  <SocialIcon platform={social.platform} className="size-4" />
                </a>
              </li>
            ))}
          </ul>

          {/*
            The ::after stretches this button across the whole card, so clicking
            anywhere on the card opens the profile — while the card still has
            exactly ONE focusable control for keyboard and screen-reader users.
          */}
          <button
            type="button"
            onClick={() => onViewProfile(trainer.id)}
            className={[
              "group/btn inline-flex min-h-9 items-center gap-2 rounded-[2px]",
              "font-mono text-[11px] uppercase tracking-[0.16em] text-chalk",
              "transition-colors duration-300 ease-out-soft hover:text-brass",
              "focus-visible:outline-2 focus-visible:outline-offset-[3px] focus-visible:outline-ember",
              "after:absolute after:inset-0 after:z-10 after:content-['']",
            ].join(" ")}
          >
            {trainersSection.cta}
            <span className="sr-only"> of {trainer.full_name}</span>
            <ArrowUpRight
              aria-hidden="true"
              className="size-4 transition-transform duration-300 ease-out-soft group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5"
            />
          </button>
        </div>
      </div>
    </article>
  );
}
