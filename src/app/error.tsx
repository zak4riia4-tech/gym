"use client";

import { useEffect } from "react";

/**
 * Catches anything that throws while rendering a page.
 *
 * The visitor is told what to do next and nothing else — no stack trace, no
 * database message, no file path. The real error goes to the server logs,
 * where the people who can act on it will see it.
 */
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[app] unhandled error", error);
  }, [error]);

  return (
    <main className="flex min-h-dvh items-center justify-center bg-void px-6 py-16">
      <div className="max-w-[34rem] text-center">
        <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-brass">
          Something went wrong
        </p>

        <h1 className="u-display mt-5 text-[clamp(1.75rem,5vw,2.5rem)] font-extrabold uppercase leading-[0.95] text-chalk">
          We could not load this page.
        </h1>

        <p className="mt-5 text-[16px] leading-relaxed text-ash">
          Try again in a moment. If it keeps happening, call the gym and we will
          sort it out over the phone.
        </p>

        <div className="mt-9 flex flex-wrap justify-center gap-3">
          <button
            type="button"
            onClick={reset}
            className="inline-flex min-h-12 items-center rounded-[2px] bg-brass px-6 font-mono text-[12px] uppercase tracking-[0.16em] text-void transition-colors duration-300 hover:bg-ember focus-visible:outline-2 focus-visible:outline-offset-[3px] focus-visible:outline-ember"
          >
            Try again
          </button>
          <a
            href="/"
            className="inline-flex min-h-12 items-center rounded-[2px] border border-chalk/25 px-6 font-mono text-[12px] uppercase tracking-[0.16em] text-chalk transition-colors duration-300 hover:bg-chalk hover:text-void focus-visible:outline-2 focus-visible:outline-offset-[3px] focus-visible:outline-ember"
          >
            Back to the main page
          </a>
        </div>

        {/* The digest is a safe, non-revealing id that matches this failure to
            a line in the server logs. */}
        {error.digest ? (
          <p className="mt-8 font-mono text-[11px] tracking-[0.08em] text-ash">
            Reference: {error.digest}
          </p>
        ) : null}
      </div>
    </main>
  );
}
