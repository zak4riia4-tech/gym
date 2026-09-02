import type { BookingRow, BookingStatus } from "@/lib/supabase/types";

/** Every status a booking can move through, in the order the gym works them. */
export const BOOKING_STATUSES: readonly BookingStatus[] = [
  "pending",
  "contacted",
  "confirmed",
  "completed",
  "cancelled",
];

export const STATUS_LABELS: Record<BookingStatus, string> = {
  pending: "Pending",
  contacted: "Contacted",
  confirmed: "Confirmed",
  completed: "Completed",
  cancelled: "Cancelled",
};

export type BookingStats = {
  total: number;
  pending: number;
  confirmed: number;
  completed: number;
};

/**
 * Counts for the overview tiles.
 *
 * Derived from the rows already on the page rather than four extra COUNT
 * queries. Correct and instant at this size; if a gym ever passes a few
 * thousand bookings, swap this for a database view.
 */
export function summarise(bookings: BookingRow[]): BookingStats {
  return {
    total: bookings.length,
    pending: bookings.filter((b) => b.status === "pending").length,
    confirmed: bookings.filter((b) => b.status === "confirmed").length,
    completed: bookings.filter((b) => b.status === "completed").length,
  };
}

/** "2 Sep 2026" — fixed locale so server and browser render identically. */
export function formatDate(value: string): string {
  return new Date(value).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

/** "2 Sep 2026, 14:32" for timestamps. */
export function formatDateTime(value: string): string {
  return new Date(value).toLocaleString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}
