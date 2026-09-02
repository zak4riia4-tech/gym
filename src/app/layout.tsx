import type { Metadata, Viewport } from "next";
import { headers } from "next/headers";
import { Archivo, IBM_Plex_Sans_Arabic, Inter_Tight, JetBrains_Mono } from "next/font/google";
import { ServiceWorker } from "@/components/layout/ServiceWorker";
import { defaultLocale, isLocale, localeConfig } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { seo } from "@/content/site";
import "./globals.css";

/* Latin faces, three roles:
   Archivo    -> headlines. "wdth" axis loaded so we can widen it.
   Inter Tight-> body copy. Narrow, so it contrasts with the wide display.
   JetBrains  -> every number, price and label. Gyms are a measuring culture. */
const archivo = Archivo({
  subsets: ["latin"],
  axes: ["wdth"],
  variable: "--font-archivo",
  display: "swap",
});

const interTight = Inter_Tight({
  subsets: ["latin"],
  variable: "--font-inter-tight",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
  display: "swap",
});

/*
 * Arabic script, used for both Kurdish Sorani and Arabic.
 *
 * Archivo and Inter Tight contain no Arabic glyphs at all, so an RTL page set
 * in them would fall back to whatever the device happens to have. IBM Plex
 * Sans Arabic also covers the Kurdish letters that the base Arabic block
 * leaves out — ڕ ڵ ێ ۆ ژ چ پ گ — which many otherwise good Arabic faces do not.
 *
 * It carries both the display and the body role in RTL: the wide-grotesque
 * idea does not transfer to Arabic script, and forcing it would look wrong
 * rather than distinctive.
 */
const plexArabic = IBM_Plex_Sans_Arabic({
  subsets: ["arabic"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-arabic",
  display: "swap",
});

export const metadata: Metadata = {
  // Makes every relative URL below absolute, which social previews require.
  metadataBase: new URL(seo.siteUrl),
  title: {
    default: seo.title,
    // Sub-pages set only their own name and inherit the brand suffix.
    template: "%s — IRONHAUS",
  },
  description: seo.description,
  applicationName: "IRONHAUS",
  openGraph: {
    type: "website",
    url: seo.siteUrl,
    siteName: "IRONHAUS",
    title: seo.ogTitle,
    description: seo.ogDescription,
  },
  twitter: {
    card: "summary_large_image",
    title: seo.ogTitle,
    description: seo.ogDescription,
  },
  appleWebApp: {
    capable: true,
    title: "IRONHAUS",
    statusBarStyle: "black-translucent",
  },
  other: {
    /* Next emits the modern `mobile-web-app-capable`. iOS before 16.4 only
       recognises the apple-prefixed one, and plenty of phones in this market
       are older than that, so both are declared. */
    "apple-mobile-web-app-capable": "yes",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
};

export const viewport: Viewport = {
  themeColor: "#0A0908",
  colorScheme: "dark",
  viewportFit: "cover",
};

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  // Set by the proxy on every request, so lang and dir are correct in the very
  // first byte of HTML rather than being corrected after hydration.
  const headerLocale = (await headers()).get("x-locale");
  const locale = headerLocale && isLocale(headerLocale) ? headerLocale : defaultLocale;
  const { dir, htmlLang } = localeConfig[locale];

  return (
    <html
      lang={htmlLang}
      dir={dir}
      data-locale={locale}
      className={`${archivo.variable} ${interTight.variable} ${jetbrainsMono.variable} ${plexArabic.variable}`}
    >
      <body className="min-h-dvh">
        {/* Without JavaScript the scroll-reveal observer never runs, so the
            content would stay at opacity 0. This puts it straight back. */}
        <noscript>
          <style
            dangerouslySetInnerHTML={{
              __html: "[data-reveal]{opacity:1!important;transform:none!important}",
            }}
          />
        </noscript>
        {children}
        <ServiceWorker />
      </body>
    </html>
  );
}
