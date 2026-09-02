"use client";

import { Inbox } from "lucide-react";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { formatDate } from "@/lib/admin/bookings";
import { titleCaseSlug } from "@/lib/content/format";
import { cn } from "@/lib/utils";
import type { BookingRow } from "@/lib/supabase/types";

/* Bookings store the plan slug, on purpose: the booking must still read
   correctly years later even if that plan has since been deleted. */
function planName(slug: string) {
  return titleCaseSlug(slug);
}

type BookingTableProps = {
  bookings: BookingRow[];
  selectedId: string | null;
  onSelect: (booking: BookingRow) => void;
};

export function BookingTable({ bookings, selectedId, onSelect }: BookingTableProps) {
  if (bookings.length === 0) {
    return (
      <div className="flex flex-col items-center gap-4 rounded-[2px] border border-dashed border-steel bg-iron px-6 py-16 text-center">
        <Inbox aria-hidden="true" className="size-7 text-ash" />
        <div>
          <p className="u-display text-[17px] font-extrabold uppercase tracking-[0.03em] text-chalk">
            No bookings yet
          </p>
          <p className="mt-2 max-w-[38ch] text-[14px] leading-relaxed text-ash">
            Requests submitted from the membership section appear here as soon
            as they arrive.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-[2px] border border-steel bg-iron">
      {/* The table scrolls inside its own box so the page itself never does.
          `relative` matters: sr-only text inside the rows is position:absolute,
          and a static container does not clip absolutely positioned children —
          they escape and stretch the whole document sideways instead. */}
      <div className="relative overflow-x-auto">
        <table className="w-full min-w-[52rem] border-collapse text-left">
          <caption className="sr-only">
            Booking requests, newest first. Select a row to see the full details.
          </caption>
          <thead>
            <tr className="border-b border-steel">
              {["Name", "Phone", "Plan", "Start date", "Status", "Received"].map((heading) => (
                <th
                  key={heading}
                  scope="col"
                  className="px-5 py-4 font-mono text-[10px] font-normal uppercase tracking-[0.18em] text-ash"
                >
                  {heading}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {bookings.map((booking) => {
              const selected = booking.id === selectedId;
              return (
                <tr
                  key={booking.id}
                  onClick={() => onSelect(booking)}
                  className={cn(
                    "cursor-pointer border-b border-steel/60 transition-colors duration-200 last:border-b-0",
                    selected ? "bg-brass/10" : "hover:bg-white/[0.03]",
                  )}
                >
                  <td className="px-5 py-4">
                    {/*
                      The button is the real control — it makes the row keyboard
                      reachable and gives screen readers something to announce.
                      The row click above is a convenience on top of it.
                    */}
                    <button
                      type="button"
                      onClick={(event) => {
                        event.stopPropagation();
                        onSelect(booking);
                      }}
                      className="rounded-[2px] text-left text-[15px] text-chalk transition-colors duration-200 hover:text-brass focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ember"
                    >
                      {booking.full_name}
                      <span className="sr-only"> — open booking details</span>
                    </button>
                  </td>
                  <td className="whitespace-nowrap px-5 py-4 font-mono text-[13px] text-ash">
                    {booking.phone_number}
                  </td>
                  <td className="whitespace-nowrap px-5 py-4 text-[14px] text-chalk">
                    {planName(booking.membership_plan)}
                  </td>
                  <td className="whitespace-nowrap px-5 py-4 font-mono text-[13px] text-ash">
                    {formatDate(booking.preferred_start_date)}
                  </td>
                  <td className="px-5 py-4">
                    <StatusBadge status={booking.status} />
                  </td>
                  <td className="whitespace-nowrap px-5 py-4 font-mono text-[13px] text-ash">
                    {formatDate(booking.created_at)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
