"use client";

import { useEffect, useRef } from "react";
import { X } from "lucide-react";
import { BookingForm } from "@/components/booking/BookingForm";
import { booking, type PlanId } from "@/content/site";
import type { MembershipPlanRow } from "@/lib/supabase/types";

type BookingModalProps = {
  open: boolean;
  /** Slug of the plan the visitor clicked, pre-selected in the form. */
  planId: PlanId | "";
  /** The live plan list, so the select always matches what is on sale. */
  plans: MembershipPlanRow[];
  onClose: () => void;
};

/**
 * Built on the native <dialog> element on purpose.
 *
 * The browser gives us focus trapping, Esc to close, returning focus to the
 * button that opened it, and making the rest of the page inert — all things a
 * hand-rolled div modal has to reimplement and usually gets wrong.
 */
export function BookingModal({ open, planId, plans, onClose }: BookingModalProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const plan = plans.find((p) => p.slug === planId);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    // Fires for Esc and for close() alike, so React state stays in step
    // with what the browser actually did.
    const handleClose = () => onClose();
    dialog.addEventListener("close", handleClose);
    return () => dialog.removeEventListener("close", handleClose);
  }, [onClose]);

  // Stop the page behind from scrolling while the dialog is up.
  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [open]);

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby="booking-heading"
      className={[
        "booking-dialog m-auto w-[min(100vw-2rem,44rem)] max-w-none rounded-[2px] p-0",
        "border border-steel bg-iron text-chalk",
        "max-h-[min(90dvh,52rem)] overflow-y-auto",
      ].join(" ")}
      // Clicking the backdrop (the dialog element itself, outside the panel)
      // closes it, matching what people expect from a modal.
      onClick={(event) => {
        if (event.target === dialogRef.current) onClose();
      }}
    >
      <div className="relative p-6 sm:p-9">
        <button
          type="button"
          onClick={onClose}
          aria-label={booking.close}
          className={[
            "absolute right-5 top-5 inline-flex size-10 items-center justify-center rounded-[2px]",
            "text-ash transition-colors duration-300 ease-out-soft hover:bg-white/5 hover:text-chalk",
            "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ember",
          ].join(" ")}
        >
          <X aria-hidden="true" className="size-5" />
        </button>

        <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-brass">
          {booking.eyebrow}
        </p>

        <h2
          id="booking-heading"
          className="u-display mt-4 max-w-[18ch] text-[clamp(1.6rem,4vw,2.25rem)] font-extrabold uppercase leading-[1] text-chalk"
        >
          {booking.title}
        </h2>

        <p className="mt-4 max-w-[52ch] text-[15px] leading-relaxed text-ash">
          {booking.description}
        </p>

        {plan ? (
          <p className="mt-5 inline-flex items-center gap-2 rounded-[2px] border border-brass/40 bg-brass/10 px-3 py-1.5 font-mono text-[11px] uppercase tracking-[0.16em] text-brass">
            {plan.name} plan
          </p>
        ) : null}

        <div className="mt-8">
          {/* Mounting the form only while the dialog is open resets every field
              between visits, and keeps the date input out of the server render. */}
          {open ? <BookingForm initialPlan={planId} plans={plans} onDone={onClose} /> : null}
        </div>
      </div>
    </dialog>
  );
}
