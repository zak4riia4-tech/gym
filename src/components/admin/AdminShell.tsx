"use client";

import { useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { BookingDetails } from "@/components/admin/BookingDetails";
import { BookingTable } from "@/components/admin/BookingTable";
import { DashboardStats } from "@/components/admin/DashboardStats";
import { summarise } from "@/lib/admin/bookings";
import type { BookingRow, BookingStatus } from "@/lib/supabase/types";

type AdminShellProps = {
  email: string;
  /** Fetched on the server, so the first paint already has the data. */
  initialBookings: BookingRow[];
};

export function AdminShell({ email, initialBookings }: AdminShellProps) {
  const router = useRouter();

  // Server data is the starting point; local state keeps the screen in step
  // after an edit without a full page reload.
  const [bookings, setBookings] = useState<BookingRow[]>(initialBookings);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [navOpen, setNavOpen] = useState(false);

  const selected = bookings.find((b) => b.id === selectedId) ?? null;
  const stats = summarise(bookings);

  const handleStatusChanged = useCallback(
    (id: string, status: BookingStatus) => {
      // 1. Update the row in place so the table and badge change immediately.
      setBookings((current) => current.map((b) => (b.id === id ? { ...b, status } : b)));
      // 2. Re-run the server component in the background to confirm against
      //    the database. No white flash, no full reload.
      router.refresh();
    },
    [router],
  );

  const closeDetails = useCallback(() => setSelectedId(null), []);

  return (
    <div className="min-h-dvh bg-void">
      <AdminSidebar open={navOpen} current="/admin/dashboard" onClose={() => setNavOpen(false)} />

      <div className="lg:pl-[16rem]">
        <AdminHeader email={email} onOpenNav={() => setNavOpen(true)} />

        <main className="px-5 py-8 lg:px-8 lg:py-10">
          <h1 className="u-display text-[clamp(1.5rem,4vw,2rem)] font-extrabold uppercase leading-none text-chalk">
            Bookings
          </h1>
          <p className="mt-3 text-[15px] text-ash">
            Every membership request from the website, newest first.
          </p>

          <div className="mt-8">
            <DashboardStats stats={stats} />
          </div>

          <h2 className="mt-12 font-mono text-[11px] uppercase tracking-[0.18em] text-ash">
            Recent bookings
          </h2>

          <div className="mt-4">
            <BookingTable
              bookings={bookings}
              selectedId={selectedId}
              onSelect={(booking) => setSelectedId(booking.id)}
            />
          </div>
        </main>
      </div>

      <BookingDetails
        booking={selected}
        onClose={closeDetails}
        onStatusChanged={handleStatusChanged}
      />
    </div>
  );
}
