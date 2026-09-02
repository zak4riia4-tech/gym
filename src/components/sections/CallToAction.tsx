import Image from "next/image";
import { ArrowRight, Phone } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { ctaSection, seo } from "@/content/site";

/**
 * The closing ask.
 *
 * The one centred section on the page. Everywhere else is deliberately offset
 * to the left; centring here is what marks this out as the end of the argument
 * rather than another band of content.
 */
export function CallToAction() {
  return (
    <section
      id="join"
      aria-labelledby="cta-heading"
      className="relative scroll-mt-24 overflow-hidden bg-void py-20 md:py-32 lg:py-44"
    >
      {/* Background photograph, held well back so the type stays the subject. */}
      <div aria-hidden="true" className="absolute inset-0 -z-10">
        <Image
          src={ctaSection.image}
          alt=""
          fill
          sizes="100vw"
          className="object-cover opacity-25 grayscale-[70%]"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-void via-void/75 to-void" />
      </div>

      <Container>
        <Reveal>
          <div className="mx-auto max-w-2xl text-center">
            <p className="font-mono text-[11px] uppercase tracking-[0.24em] text-brass">
              {ctaSection.eyebrow}
            </p>

            <h2
              id="cta-heading"
              className="u-display mt-6 text-[clamp(2rem,6vw,3.5rem)] font-extrabold uppercase leading-[0.95] text-chalk"
            >
              {ctaSection.title}
            </h2>

            <p className="mx-auto mt-6 max-w-[52ch] text-[16px] leading-relaxed text-ash md:text-[17px]">
              {ctaSection.description}
            </p>

            <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <a
                href="#membership"
                className="inline-flex min-h-13 w-full items-center justify-center gap-2.5 rounded-[2px] bg-brass px-7 font-mono text-[12px] uppercase tracking-[0.16em] text-void transition-[background-color,box-shadow,transform] duration-500 ease-gentle hover:bg-ember hover:shadow-brass motion-safe:hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-[3px] focus-visible:outline-ember sm:w-auto"
              >
                {ctaSection.primary}
                <ArrowRight aria-hidden="true" className="size-4" />
              </a>

              {/* A real tel: link — on a phone this dials, which is how most
                  enquiries in this market actually start. */}
              <a
                href={`tel:${seo.business.phone.replace(/\s+/g, "")}`}
                className="inline-flex min-h-13 w-full items-center justify-center gap-2.5 rounded-[2px] border border-chalk/25 px-7 font-mono text-[12px] uppercase tracking-[0.16em] text-chalk transition-[background-color,border-color,color,transform] duration-500 ease-gentle hover:border-chalk hover:bg-chalk hover:text-void motion-safe:hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-[3px] focus-visible:outline-ember sm:w-auto"
              >
                <Phone aria-hidden="true" className="size-4" />
                {ctaSection.secondary}
              </a>
            </div>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
