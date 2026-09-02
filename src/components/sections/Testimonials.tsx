import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { getServerI18n } from "@/lib/i18n/server";

/**
 * Three quotes, side by side, on the light surface.
 *
 * A static grid, not a carousel. A carousel hides two thirds of what people
 * said behind a control nobody presses, and adds a keyboard trap to a section
 * that is pure reading.
 *
 * This is the second light section on the page, placed here on purpose: after
 * the dark gallery it resets the eye before the closing call to action.
 */
export async function Testimonials() {
  const { dict } = await getServerI18n();
  const testimonialsSection = dict.testimonials;
  const testimonials = dict.testimonials.items;

  return (
    <section
      id="testimonials"
      aria-labelledby="testimonials-heading"
      className="scroll-mt-24 bg-chalk py-16 md:py-28 lg:py-40"
    >
      <Container>
        {/* Centred and larger than the other section headings — the page has
            made its argument by now, and this is the evidence. */}
        <Reveal>
          <div className="mx-auto max-w-3xl text-center">
            <p className="font-mono text-[11px] uppercase tracking-[0.24em] text-bronze">
              {testimonialsSection.eyebrow}
            </p>
            <h2
              id="testimonials-heading"
              className="u-display mt-6 text-[clamp(2.25rem,6vw,4.25rem)] font-extrabold uppercase leading-[0.92] text-void"
            >
              {testimonialsSection.title}
            </h2>
          </div>
        </Reveal>

        <div className="mt-14 grid gap-8 lg:mt-20 lg:grid-cols-3 lg:gap-10">
          {testimonials.map((item, index) => (
            <Reveal key={item.name} delay={140 + index * 90} className="h-full">
              <figure className="flex h-full flex-col border-t border-void/15 pt-8">
                {/* The quote mark is drawn as type, not an icon: it belongs to
                    the words, so it should be set in the same family. */}
                <span
                  aria-hidden="true"
                  className="u-display block text-[42px] font-extrabold leading-none text-bronze/45"
                >
                  &ldquo;
                </span>

                <blockquote className="mt-3 text-[17px] leading-relaxed text-void md:text-[18px]">
                  {item.quote}
                </blockquote>

                <figcaption className="mt-auto pt-8">
                  <p className="u-display text-[15px] font-extrabold uppercase tracking-[0.05em] text-void">
                    {item.name}
                  </p>
                  <p className="mt-1.5 font-mono text-[11px] uppercase tracking-[0.16em] text-graphite">
                    {item.detail}
                  </p>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
