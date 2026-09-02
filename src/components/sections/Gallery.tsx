import Image from "next/image";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { galleryImages, gallerySection } from "@/content/site";

/**
 * The floor, in pictures.
 *
 * An uneven grid rather than a tidy 3x2: one image leads and the rest fall in
 * around it, which reads as a considered set instead of a contact sheet.
 * No lightbox — there is nothing to read in a larger version of a photograph,
 * and it would add a focus trap for no gain.
 */
export function Gallery() {
  return (
    <section
      id="gallery"
      aria-labelledby="gallery-heading"
      className="u-ambient scroll-mt-24 bg-void py-24 md:py-32 lg:py-40"
    >
      <Container>
        <Reveal>
          <SectionHeading
            id="gallery-heading"
            tone="dark"
            eyebrow={gallerySection.eyebrow}
            title={gallerySection.title}
            description={gallerySection.description}
          />
        </Reveal>
      </Container>

      {/* Deliberately outside the container: the photographs run to both edges
          of the screen while every other section stays inside the measure.
          That single break is what stops the page reading as one long column. */}
      <div className="px-2 lg:px-3">

        <div className="mt-14 grid auto-rows-[13rem] grid-cols-1 gap-2 sm:grid-cols-2 md:grid-cols-4 md:auto-rows-[12rem] lg:mt-20 lg:auto-rows-[15rem] lg:gap-3">
          {galleryImages.map((image, index) => (
            <Reveal
              key={image.src}
              delay={120 + index * 70}
              className={`group relative overflow-hidden rounded-[2px] ${image.span}`}
            >
              <Image
                src={image.src}
                alt={image.alt}
                fill
                sizes="(min-width: 768px) 50vw, 100vw"
                // Desaturated so six photographs from six different rooms read
                // as one set, then full colour under the cursor.
                className="object-cover grayscale-[55%] brightness-[0.82] contrast-[1.06] transition-[filter,transform] duration-[1100ms] ease-gentle group-hover:grayscale-0 group-hover:brightness-100 motion-safe:group-hover:scale-[1.05]"
              />
              <div
                aria-hidden="true"
                className="absolute inset-0 bg-gradient-to-t from-void/55 via-transparent to-transparent"
              />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
