import type { Metadata, Viewport } from "next";
import { Archivo, Inter_Tight, JetBrains_Mono } from "next/font/google";
import { seo } from "@/content/site";
import "./globals.css";

/* Three faces, three jobs.
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
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: seo.locale,
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
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
};

export const viewport: Viewport = {
  // Matches the page background, so mobile browser chrome does not flash white.
  themeColor: "#08090B",
  colorScheme: "dark",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${archivo.variable} ${interTight.variable} ${jetbrainsMono.variable}`}
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
      </body>
    </html>
  );
}
