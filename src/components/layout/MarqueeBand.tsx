import { getServerI18n } from "@/lib/i18n/server";
import { programs, site } from "@/content/site";

/**
 * A slow strip of type between sections.
 *
 * Seven sections in a row with the same heading above the same grid is what
 * makes a site feel templated. This breaks that rhythm without adding another
 * block of content to read — it is texture, not information, which is why the
 * type is outlined rather than filled and the whole strip is hidden from
 * screen readers.
 */
export async function MarqueeBand() {
  const { dict } = await getServerI18n();
  const words = [
    site.brand.name,
    ...programs.map((p) => dict.programs.items[p.id].name),
    site.brand.city,
  ];

  return (
    <div
      aria-hidden="true"
      className="relative overflow-hidden border-y border-steel bg-void py-5 select-none md:py-7"
    >
      <div className="marquee-track flex w-max items-center gap-10">
        {/* Rendered twice: the animation travels exactly half the track, so the
            second copy is in the first one's place when it loops. */}
        {[0, 1].map((copy) => (
          <div key={copy} className="flex items-center gap-10">
            {words.map((word) => (
              <span key={word} className="flex items-center gap-10">
                <span className="u-display marquee-word whitespace-nowrap text-[clamp(1.75rem,4vw,3rem)] font-extrabold uppercase leading-none">
                  {word}
                </span>
                <span className="size-1.5 shrink-0 rounded-full bg-brass/60" />
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
