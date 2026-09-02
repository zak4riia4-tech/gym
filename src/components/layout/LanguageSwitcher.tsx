"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Check, Globe } from "lucide-react";
import { locales, localeConfig, isLocale, type Locale } from "@/lib/i18n/config";
import { useI18n } from "@/lib/i18n/context";
import { cn } from "@/lib/utils";

/**
 * Language menu.
 *
 * Each option is a real link, so it works without JavaScript, opens in a new
 * tab if someone middle-clicks it, and tells a search engine that the three
 * URLs are the same page in different languages.
 */
export function LanguageSwitcher({ className }: { className?: string }) {
  const { locale, dict } = useI18n();
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onPointer = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) setOpen(false);
    };
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onPointer);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onPointer);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  /** Swap the language segment, keeping whatever path follows it. */
  function hrefFor(next: Locale) {
    const segments = pathname.split("/").filter(Boolean);
    if (segments.length > 0 && isLocale(segments[0])) segments[0] = next;
    else segments.unshift(next);
    return `/${segments.join("/")}`;
  }

  return (
    <div ref={ref} className={cn("relative", className)}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-haspopup="menu"
        aria-label={dict.nav.language}
        className="inline-flex min-h-11 items-center gap-2 rounded-[2px] px-2.5 font-mono text-[11px] uppercase text-ash transition-colors duration-500 ease-gentle hover:text-chalk focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ember"
      >
        <Globe aria-hidden="true" className="size-4" />
        <span>{localeConfig[locale].label}</span>
      </button>

      {open ? (
        <ul
          role="menu"
          className="absolute end-0 top-full z-50 mt-2 min-w-[11rem] rounded-[2px] border border-steel bg-iron py-1 shadow-featured"
        >
          {locales.map((option) => {
            const active = option === locale;
            return (
              <li key={option} role="none">
                <a
                  role="menuitem"
                  href={hrefFor(option)}
                  hrefLang={localeConfig[option].htmlLang}
                  onClick={(event) => {
                    // Client navigation keeps the scroll position; the proxy
                    // still sets the cookie and the header on the request.
                    event.preventDefault();
                    setOpen(false);
                    router.push(hrefFor(option));
                    router.refresh();
                  }}
                  className={cn(
                    "flex min-h-11 items-center justify-between gap-3 px-4 text-[14px]",
                    "transition-colors duration-300 ease-gentle",
                    "focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-ember",
                    active ? "text-brass" : "text-ash hover:bg-white/[0.04] hover:text-chalk",
                  )}
                >
                  <span dir={localeConfig[option].dir}>{localeConfig[option].label}</span>
                  {active ? <Check aria-hidden="true" className="size-3.5" /> : null}
                </a>
              </li>
            );
          })}
        </ul>
      ) : null}
    </div>
  );
}
