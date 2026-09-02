import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Footer } from "@/components/layout/Footer";
import { InstallPrompt } from "@/components/layout/InstallPrompt";
import { MarqueeBand } from "@/components/layout/MarqueeBand";
import { Navbar } from "@/components/layout/Navbar";
import { CallToAction } from "@/components/sections/CallToAction";
import { Gallery } from "@/components/sections/Gallery";
import { Hero } from "@/components/sections/Hero";
import { Membership } from "@/components/sections/Membership";
import { Programs } from "@/components/sections/Programs";
import { Testimonials } from "@/components/sections/Testimonials";
import { Trainers } from "@/components/sections/Trainers";
import { WhyChooseUs } from "@/components/sections/WhyChooseUs";
import { I18nProvider } from "@/lib/i18n/context";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { isLocale, locales, localeConfig } from "@/lib/i18n/config";
import { seo, site } from "@/content/site";

/*
 * Rendered per request, not at build time.
 *
 * Plans and trainers come from the database, so a statically prerendered
 * homepage would keep serving whatever was true when the site was last built —
 * an edit in the admin would appear to do nothing.
 */
export const dynamic = "force-dynamic";

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const dict = getDictionary(locale);

  return {
    title: dict.seo.title,
    description: dict.seo.description,
    openGraph: { title: dict.seo.ogTitle, description: dict.seo.ogDescription },
    twitter: { title: dict.seo.ogTitle, description: dict.seo.ogDescription },
    alternates: {
      canonical: `/${locale}`,
      // Tells a search engine these three URLs are the same page in different
      // languages, so it shows the right one rather than treating them as
      // duplicates competing with each other.
      languages: Object.fromEntries(
        locales.map((l) => [localeConfig[l].htmlLang, `/${l}`]),
      ),
    },
  };
}

export default async function Home({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  const dict = getDictionary(locale);
  const dir = localeConfig[locale].dir;

  /*
   * Structured data, translated. This is how a search engine understands the
   * page describes a real gym in Erbil rather than a blog post.
   *
   * The address and phone are placeholders from site.ts — replace them with the
   * gym's real details before launch. Publishing an address that is not theirs
   * is worse than publishing none.
   */
  const businessSchema = {
    "@context": "https://schema.org",
    "@type": "ExerciseGym",
    name: site.brand.name,
    legalName: seo.business.legalName,
    description: dict.seo.description,
    url: `${seo.siteUrl}/${locale}`,
    telephone: seo.business.phone,
    openingHours: seo.business.openingHours,
    address: {
      "@type": "PostalAddress",
      streetAddress: seo.business.streetAddress,
      addressLocality: seo.business.city,
      addressRegion: seo.business.region,
      addressCountry: seo.business.country,
    },
  };

  return (
    <I18nProvider value={{ locale, dir, dict }}>
      <script
        type="application/ld+json"
        // Static object built above, never user input.
        dangerouslySetInnerHTML={{ __html: JSON.stringify(businessSchema) }}
      />

      {/* Skip link — the first thing a keyboard user reaches. */}
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:start-4 focus:top-4 focus:z-[60] focus:rounded-[2px] focus:bg-brass focus:px-4 focus:py-3 focus:font-mono focus:text-[12px] focus:uppercase focus:text-void"
      >
        {dict.common.skipToContent}
      </a>

      <Navbar />

      {/* Section order follows the plan approved in step one. Dark and light
          alternate so the page has rhythm rather than one long dark scroll. */}
      <main id="main">
        <Hero />
        <WhyChooseUs />
        <Programs />
        <MarqueeBand />
        <Membership />
        <Trainers />
        <Gallery />
        <Testimonials />
        <CallToAction />
      </main>

      <Footer />
      <InstallPrompt />
    </I18nProvider>
  );
}
