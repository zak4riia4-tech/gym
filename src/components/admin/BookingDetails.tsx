"use client";

import { useEffect, useRef, useState } from "react";
import { Check, Loader2, TriangleAlert, X } from "lucide-react";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { BOOKING_STATUSES, STATUS_LABELS, formatDate, formatDateTime } from "@/lib/admin/bookings";
import { getAdminBrowserClient } from "@/lib/supabase/browser";
import { titleCaseSlug } from "@/lib/content/format";
import { cn } from "@/lib/utils";
import type { BookingRow, BookingStatus } from "@/lib/supabase/types";

type SaveState = "idle" | "saving" | "saved" | "error";

type BookingDetailsProps = {
  booking: BookingRow | null;
  onClose: () => void;
  /** Called with the new status once the database has confirmed the change. */
  onStatusChanged: (id: string, status: BookingStatus) => void;
};

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="border-b border-steel/60 py-3.5 last:border-b-0">
      <dt className="font-mono text-[10px] uppercase tracking-[0.18em] text-ash">{label}</dt>
      <dd className="mt-1.5 text-[15px] leading-relaxed text-chalk">{value}</dd>
    </div>
  );
}

export function BookingDetails({ booking, onClose, onStatusChanged }: BookingDetailsProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [saveState, setSaveState] = useState<SaveState>("idle");
  const [failure, setFailure] = useState("");
  const [pendingStatus, setPendingStatus] = useState<BookingStatus | null>(null);

  const open = booking !== null;

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    const handleClose = () => onClose();
    dialog.addEventListener("close", handleClose);
    return () => dialog.removeEventListener("close", handleClose);
  }, [onClose]);

  // Clear the save feedback whenever a different booking is opened.
  useEffect(() => {
    setSaveState("idle");
    setFailure("");
    setPendingStatus(null);
  }, [booking?.id]);

  async function changeStatus(next: BookingStatus) {
    if (!booking || next === booking.status) return;

    setPendingStatus(next);
    setSaveState("saving");
    setFailure("");

    const supabase = getAdminBrowserClient();
    const { error } = await supabase
      .from("bookings")
      .update({ status: next })
      .eq("id", booking.id);

    if (error) {
      console.error("[admin] status update failed", error);
      setFailure(
        error.code === "42501"
          ? "Your account is not allowed to change this booking."
          : "Could not save the new status. Please try again.",
      );
      setSaveState("error");
      setPendingStatus(null);
      return;
    }

    // Only now, once the database has confirmed it, does the screen change.
    onStatusChanged(booking.id, next);
    setSaveState("saved");
    setPendingStatus(null);
  }

  const planName = booking ? titleCaseSlug(booking.membership_plan) : "";

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby="booking-details-heading"
      className={[
        "booking-dialog m-auto w-[min(100vw-2rem,40rem)] max-w-none rounded-[2px] p-0",
        "border border-steel bg-iron text-chalk",
        "max-h-[min(90dvh,52rem)] overflow-y-auto",
      ].join(" ")}
      onClick={(event) => {
        if (event.target === dialogRef.current) onClose();
      }}
    >
      {booking ? (
        <div className="relative p-6 sm:p-8">
          <button
            type="button"
            onClick={onClose}
            aria-label="Close booking details"
            className="absolute right-4 top-4 inline-flex size-10 items-center justify-center rounded-[2px] text-ash transition-colors duration-200 hover:bg-white/5 hover:text-chalk focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ember"
          >
            <X aria-hidden="true" className="size-5" />
          </button>

          <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-brass">
            Booking request
          </p>

          <h2
            id="booking-details-heading"
            className="u-display mt-3 pr-12 text-[26px] font-extrabold uppercase leading-tight text-chalk"
          >
            {booking.full_name}
          </h2>

          <div className="mt-4">
            <StatusBadge status={booking.status} />
          </div>

          <dl className="mt-7">
            <Row label="Email" value={booking.email} />
            <Row label="Phone number" value={booking.phone_number} />
            <Row label="Membership plan" value={planName} />
            <Row label="Preferred start date" value={formatDate(booking.preferred_start_date)} />
            <Row label="Fitness goal" value={booking.fitness_goal || "Not given"} />
            <Row label="Message" value={booking.message || "None"} />
            <Row label="Booking received" value={formatDateTime(booking.created_at)} />
          </dl>

          {/* --- Status control --- */}
          <div className="mt-8 border-t border-steel pt-6">
            <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-ash">
              Change status
            </p>

            <div className="mt-4 flex flex-wrap gap-2">
              {BOOKING_STATUSES.map((status) => {
                const active = booking.status === status;
                const busy = pendingStatus === status;
                return (
                  <button
                    key={status}
                    type="button"
                    disabled={saveState === "saving" || active}
                    aria-current={active ? "true" : undefined}
                    onClick={() => changeStatus(status)}
                    className={cn(
                      "inline-flex min-h-10 items-center gap-2 rounded-[2px] border px-3.5",
                      "font-mono text-[11px] uppercase tracking-[0.14em]",
                      "transition-colors duration-200",
                      "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ember",
                      "disabled:cursor-not-allowed",
                      active
                        ? "border-brass bg-brass text-void"
                        : "border-steel text-ash hover:border-ash hover:text-chalk disabled:opacity-50",
                    )}
                  >
                    {busy ? (
                      <Loader2 aria-hidden="true" className="size-3.5 motion-safe:animate-spin" />
                    ) : null}
                    {STATUS_LABELS[status]}
                  </button>
                );
              })}
            </div>

            {/* aria-live announces the result without stealing focus. */}
            <div aria-live="polite" className="mt-4 min-h-6">
              {saveState === "saved" ? (
                <p className="flex items-center gap-2 text-[13px] text-success">
                  <Check aria-hidden="true" className="size-4" />
                  Status saved.
                </p>
              ) : null}

              {saveState === "error" && failure ? (
                <p role="alert" className="flex items-start gap-2 text-[13px] leading-snug text-danger">
                  <TriangleAlert aria-hidden="true" className="mt-0.5 size-4 shrink-0" />
                  {failure}
                </p>
              ) : null}
            </div>
          </div>
        </div>
      ) : null}
    </dialog>
  );
}
