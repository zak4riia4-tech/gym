"use client";

import { useState, type ReactNode } from "react";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { AdminSidebar } from "@/components/admin/AdminSidebar";

/**
 * Sidebar + header wrapper for the content pages.
 *
 * The bookings dashboard keeps its own shell because it also owns the booking
 * selection state; this one exists so every other admin page shares the exact
 * same chrome without duplicating it.
 */
export function AdminContentShell({
  email,
  current,
  children,
}: {
  email: string;
  current: string;
  children: ReactNode;
}) {
  const [navOpen, setNavOpen] = useState(false);

  return (
    <div className="min-h-dvh bg-void">
      <AdminSidebar open={navOpen} current={current} onClose={() => setNavOpen(false)} />

      <div className="lg:pl-[16rem]">
        <AdminHeader email={email} onOpenNav={() => setNavOpen(true)} />
        <main className="px-5 py-8 lg:px-8 lg:py-10">{children}</main>
      </div>
    </div>
  );
}
