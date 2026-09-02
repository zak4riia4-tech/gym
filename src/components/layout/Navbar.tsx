"use client";

import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { nav, site } from "@/content/site";

/**
 * Fixed navigation.
 *
 * Transparent while sitting over the hero, then it grows a background and a
 * hairline once you scroll past it — so the wordmark stays readable against
 * whatever section is underneath without ever boxing in the hero image.
 */
export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Esc closes the mobile menu, and the page behind must not scroll under it.
  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", onKey);
    };
  }, [menuOpen]);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-40",
        "transition-[background-color,border-color,backdrop-filter] duration-700 ease-gentle",
        scrolled
          ? "border-b border-steel bg-void/80 backdrop-blur-md"
          : "border-b border-transparent bg-transparent",
      )}
    >
      <nav
        aria-label="Main"
        className="mx-auto flex h-18 w-full max-w-[1280px] items-center justify-between px-6 md:px-10 lg:px-12"
      >
        <a
          href="#main"
          className="u-display rounded-[2px] text-[17px] font-extrabold uppercase tracking-[0.08em] text-chalk transition-colors duration-500 ease-gentle hover:text-brass focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ember"
        >
          {site.brand.name}
        </a>

        {/* Desktop links */}
        <ul className="hidden items-center gap-9 lg:flex">
          {nav.links.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                className="rounded-[2px] font-mono text-[11px] uppercase tracking-[0.18em] text-ash transition-colors duration-500 ease-gentle hover:text-chalk focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ember"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-3">
          <a
            href="#membership"
            className="hidden min-h-11 items-center rounded-[2px] bg-brass px-5 font-mono text-[11px] uppercase tracking-[0.16em] text-void transition-[background-color,box-shadow,transform] duration-500 ease-gentle hover:bg-ember hover:shadow-brass motion-safe:hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-[3px] focus-visible:outline-ember sm:inline-flex"
          >
            {nav.cta}
          </a>

          <button
            type="button"
            onClick={() => setMenuOpen(true)}
            aria-label={nav.openMenu}
            aria-expanded={menuOpen}
            className="inline-flex size-11 items-center justify-center rounded-[2px] text-chalk transition-colors duration-500 ease-gentle hover:text-brass focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ember lg:hidden"
          >
            <Menu aria-hidden="true" className="size-5" />
          </button>
        </div>
      </nav>

      {/* Mobile overlay. Hidden with `invisible` rather than only faded, so its
          links leave the tab order entirely when the menu is closed. */}
      <div
        className={cn(
          "fixed inset-0 z-50 flex flex-col bg-void lg:hidden",
          "transition-[opacity,visibility] duration-500 ease-gentle",
          menuOpen ? "visible opacity-100" : "invisible opacity-0",
        )}
      >
        <div className="flex h-18 items-center justify-between px-6 md:px-10">
          <span className="u-display text-[17px] font-extrabold uppercase tracking-[0.08em] text-chalk">
            {site.brand.name}
          </span>
          <button
            type="button"
            onClick={() => setMenuOpen(false)}
            aria-label={nav.closeMenu}
            className="inline-flex size-11 items-center justify-center rounded-[2px] text-chalk transition-colors duration-500 ease-gentle hover:text-brass focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ember"
          >
            <X aria-hidden="true" className="size-5" />
          </button>
        </div>

        <ul className="flex flex-col gap-2 px-6 pt-8 md:px-10">
          {nav.links.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className="u-display block rounded-[2px] py-3 text-[30px] font-extrabold uppercase leading-none text-chalk transition-colors duration-500 ease-gentle hover:text-brass focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ember"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="mt-auto p-6 md:p-10">
          <a
            href="#membership"
            onClick={() => setMenuOpen(false)}
            className="inline-flex min-h-13 w-full items-center justify-center rounded-[2px] bg-brass px-6 font-mono text-[12px] uppercase tracking-[0.16em] text-void transition-colors duration-500 ease-gentle hover:bg-ember focus-visible:outline-2 focus-visible:outline-offset-[3px] focus-visible:outline-ember"
          >
            {nav.cta}
          </a>
        </div>
      </div>
    </header>
  );
}
