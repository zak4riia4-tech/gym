import type { Metadata } from "next";
import { site } from "@/content/site";

export const metadata: Metadata = {
  title: "Page not found",
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <main className="flex min-h-dvh items-center justify-center bg-void px-6 py-16">
      <div className="max-w-[34rem] text-center">
        <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-brass">
          Error 404
        </p>

        <h1 className="u-display mt-5 text-[clamp(2rem,6vw,3rem)] font-extrabold uppercase leading-[0.95] text-chalk">
          This page does not exist.
        </h1>

        <p className="mt-5 text-[16px] leading-relaxed text-ash">
          The link may be out of date, or the address mistyped. Everything about
          memberships, programmes and coaching is on the main page.
        </p>

        <a
          href="/"
          className="mt-9 inline-flex min-h-12 items-center rounded-[2px] bg-brass px-6 font-mono text-[12px] uppercase tracking-[0.16em] text-void transition-colors duration-300 hover:bg-ember focus-visible:outline-2 focus-visible:outline-offset-[3px] focus-visible:outline-ember"
        >
          Back to {site.brand.name}
        </a>
      </div>
    </main>
  );
}
