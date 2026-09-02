import { Clock, MapPin, Phone } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { SocialIcon, SOCIAL_LABELS } from "@/components/ui/SocialIcon";
import { footer, nav, programs, seo, site } from "@/content/site";

const SOCIALS = [
  { platform: "instagram" as const, href: "https://instagram.com/ironhaus.erbil" },
  { platform: "facebook" as const, href: "https://facebook.com/ironhaus.erbil" },
];

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-steel bg-void">
      <Container>
        <div className="grid gap-12 py-16 md:grid-cols-2 lg:grid-cols-4 lg:py-20">
          {/* Brand */}
          <div className="lg:pr-8">
            <p className="u-display text-[19px] font-extrabold uppercase tracking-[0.08em] text-chalk">
              {site.brand.name}
            </p>
            <p className="mt-4 max-w-[36ch] text-[15px] leading-relaxed text-ash">
              {footer.blurb}
            </p>

            <ul className="mt-7 flex items-center gap-1">
              {SOCIALS.map((social) => (
                <li key={social.platform}>
                  <a
                    href={social.href}
                    aria-label={`${site.brand.name} on ${SOCIAL_LABELS[social.platform]}`}
                    className="inline-flex size-10 items-center justify-center rounded-[2px] text-ash transition-colors duration-500 ease-gentle hover:bg-white/5 hover:text-brass focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ember"
                  >
                    <SocialIcon platform={social.platform} className="size-4" />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Navigation */}
          {footer.columns.map((column) => (
            <nav key={column.heading} aria-label={column.heading}>
              <h2 className="font-mono text-[11px] uppercase tracking-[0.18em] text-brass">
                {column.heading}
              </h2>
              <ul className="mt-4 flex flex-col">
                {column.links.map((link) => (
                  <li key={link.href}>
                    <a
                      href={link.href}
                      className="inline-block rounded-[2px] py-2.5 text-[15px] text-ash transition-colors duration-500 ease-gentle hover:text-chalk focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ember"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          ))}

          {/* Programmes — read from the same array the section renders, so the
              footer can never list a programme that no longer exists. */}
          <div>
            <h2 className="font-mono text-[11px] uppercase tracking-[0.18em] text-brass">
              Programmes
            </h2>
            <ul className="mt-4 flex flex-col">
              {programs.map((program) => (
                <li key={program.id}>
                  <a
                    href="#programs"
                    className="inline-block rounded-[2px] py-2.5 text-[15px] text-ash transition-colors duration-500 ease-gentle hover:text-chalk focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ember"
                  >
                    {program.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h2 className="font-mono text-[11px] uppercase tracking-[0.18em] text-brass">
              {footer.contactHeading}
            </h2>
            <ul className="mt-5 flex flex-col gap-4 text-[15px] text-ash">
              <li className="flex items-start gap-3">
                <MapPin aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-ash" />
                <span>
                  {seo.business.streetAddress}
                  <br />
                  {seo.business.city}, {seo.business.region}
                </span>
              </li>
              <li className="flex items-start gap-3">
                <Phone aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-ash" />
                <a
                  href={`tel:${seo.business.phone.replace(/\s+/g, "")}`}
                  className="-my-2 inline-block rounded-[2px] py-2 transition-colors duration-500 ease-gentle hover:text-chalk focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ember"
                >
                  {seo.business.phone}
                </a>
              </li>
              <li className="flex items-start gap-3">
                <Clock aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-ash" />
                <span className="font-mono text-[13px] tracking-[0.06em]">
                  {seo.business.openingHours}
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col gap-4 border-t border-steel py-7 sm:flex-row sm:items-center sm:justify-between">
          <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-ash">
            &copy; {year} {site.brand.name}. {footer.legal}
          </p>

          <a
            href={footer.staffLink.href}
            className="-my-2 inline-block rounded-[2px] py-2 font-mono text-[11px] uppercase tracking-[0.14em] text-ash transition-colors duration-500 ease-gentle hover:text-brass focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ember"
          >
            {footer.staffHeading} · {footer.staffLink.label}
          </a>
        </div>
      </Container>
    </footer>
  );
}
