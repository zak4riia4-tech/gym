import { cn } from "@/lib/utils";
import { STATUS_LABELS } from "@/lib/admin/bookings";
import type { BookingStatus } from "@/lib/supabase/types";

/* Colour carries meaning here, so each badge also states its status in words —
   nobody has to decode the palette. */
const TONE: Record<BookingStatus, string> = {
  pending: "border-ash/40 bg-ash/10 text-ash",
  contacted: "border-info/40 bg-info/10 text-info",
  confirmed: "border-brass/45 bg-brass/10 text-brass",
  completed: "border-success/40 bg-success/10 text-success",
  cancelled: "border-danger/40 bg-danger/10 text-danger",
};

export function StatusBadge({ status, className }: { status: BookingStatus; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center whitespace-nowrap rounded-[2px] border px-2.5 py-1",
        "font-mono text-[10px] uppercase tracking-[0.16em]",
        TONE[status],
        className,
      )}
    >
      {STATUS_LABELS[status]}
    </span>
  );
}
