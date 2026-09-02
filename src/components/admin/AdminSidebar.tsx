"use client";

import { CalendarDays, Layers, LayoutDashboard, Users, X } from "lucide-react";
import { site } from "@/content/site";
import { cn } from "@/lib/utils";

/* Adding a section later is a data change, not a layout rewrite. */
const NAV = [
  { label: "Bookings", href: "/admin/dashboard", icon: LayoutDashboard },
  { label: "Memberships", href: "/admin/memberships", icon: Layers },
  { label: "Trainers", href: "/admin/trainers", icon: Users },
] as const;

type AdminSidebarProps = {
  /** Mobile only — on desktop the sidebar is always visible. */
  open: boolean;
  /** Pathname of the page being shown, so one link is marked as current. */
  current?: string;
  onClose: () => void;
};

export function AdminSidebar({ open, current = "/admin/dashboard", onClose }: AdminSidebarProps) {
  return (
    <>
      {/* Mobile scrim. Hidden from assistive tech; the close button is the
          labelled control. */}
      <div
        aria-hidden="true"
        onClick={onClose}
        className={cn(
          "fixed inset-0 z-30 bg-void/80 backdrop-blur-sm transition-opacity duration-200 lg:hidden",
          open ? "opacity-100" : "pointer-events-none opacity-0",
        )}
      />

      <aside
        aria-label="Dashboard navigation"
        className={cn(
          "fixed inset-y-0 left-0 z-40 flex w-[16rem] flex-col border-r border-steel bg-iron",
          "transition-[transform,visibility] duration-200 ease-out-soft",
          // `invisible` rather than only sliding it away: an off-screen element
          // is still in the tab order, so a keyboard user would land on links
          // they cannot see. visibility:hidden removes it from focus and from
          // screen readers, and lg:visible keeps the desktop sidebar usable.
          "lg:visible lg:translate-x-0",
          open ? "visible translate-x-0" : "invisible -translate-x-full",
        )}
      >
        <div className="flex items-center justify-between border-b border-steel px-6 py-5">
          <div>
            <p className="u-display text-[15px] font-extrabold uppercase tracking-[0.06em] text-chalk">
              {site.brand.name}
            </p>
            <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.18em] text-brass">
              Staff dashboard
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close navigation"
            className="inline-flex size-10 items-center justify-center rounded-[2px] text-ash transition-colors duration-200 hover:text-chalk focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ember lg:hidden"
          >
            <X aria-hidden="true" className="size-5" />
          </button>
        </div>

        <nav className="flex-1 px-3 py-5">
          <ul className="flex flex-col gap-1">
            {NAV.map(({ label, href, icon: Icon }) => {
              const isCurrent = href === current;
              return (
              <li key={href}>
                <a
                  href={href}
                  aria-current={isCurrent ? "page" : undefined}
                  className={cn(
                    "flex items-center gap-3 rounded-[2px] px-3 py-3",
                    "font-mono text-[11px] uppercase tracking-[0.16em]",
                    "transition-colors duration-200",
                    "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ember",
                    isCurrent
                      ? "bg-brass/12 text-brass"
                      : "text-ash hover:bg-white/[0.04] hover:text-chalk",
                  )}
                >
                  <Icon aria-hidden="true" className="size-4 shrink-0" />
                  {label}
                </a>
              </li>
              );
            })}
          </ul>
        </nav>

        <div className="border-t border-steel px-6 py-5">
          <p className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.16em] text-ash">
            <CalendarDays aria-hidden="true" className="size-3.5" />
            {site.brand.city}
          </p>
        </div>
      </aside>
    </>
  );
}
