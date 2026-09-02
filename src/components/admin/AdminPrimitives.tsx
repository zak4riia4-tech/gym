"use client";

import { useEffect, useRef } from "react";
import { Check, Loader2, TriangleAlert, X } from "lucide-react";
import { cn } from "@/lib/utils";

/* ==========================================================================
   Shared pieces for the content-management screens, so the memberships and
   trainers pages cannot drift apart in look or behaviour.
   ========================================================================== */

/** Success / failure notice. aria-live means it is announced, not just seen. */
export function Toast({
  message,
  tone,
  onDismiss,
}: {
  message: string;
  tone: "success" | "error";
  onDismiss: () => void;
}) {
  // Success messages clear themselves; errors stay until dismissed.
  useEffect(() => {
    if (tone !== "success") return;
    const timer = setTimeout(onDismiss, 4000);
    return () => clearTimeout(timer);
  }, [tone, message, onDismiss]);

  return (
    <div
      role="status"
      aria-live="polite"
      className={cn(
        "fixed bottom-5 left-1/2 z-50 flex max-w-[calc(100vw-2rem)] -translate-x-1/2 items-start gap-3",
        "rounded-[2px] border px-4 py-3 text-[14px] leading-snug shadow-featured",
        tone === "success"
          ? "border-success/40 bg-iron text-success"
          : "border-danger/40 bg-iron text-danger",
      )}
    >
      {tone === "success" ? (
        <Check aria-hidden="true" className="mt-0.5 size-4 shrink-0" />
      ) : (
        <TriangleAlert aria-hidden="true" className="mt-0.5 size-4 shrink-0" />
      )}
      <span>{message}</span>
      <button
        type="button"
        onClick={onDismiss}
        aria-label="Dismiss notification"
        className="-my-1 ml-2 inline-flex size-7 shrink-0 items-center justify-center rounded-[2px] text-ash transition-colors hover:text-chalk focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ember"
      >
        <X aria-hidden="true" className="size-3.5" />
      </button>
    </div>
  );
}

/**
 * Deletion is the one action here that cannot be undone, so it always goes
 * through this. Nothing is removed on a single stray click.
 */
export function ConfirmDialog({
  open,
  title,
  body,
  confirmLabel = "Delete",
  busy,
  onConfirm,
  onCancel,
}: {
  open: boolean;
  title: string;
  body: string;
  confirmLabel?: string;
  busy: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    const handleClose = () => onCancel();
    dialog.addEventListener("close", handleClose);
    return () => dialog.removeEventListener("close", handleClose);
  }, [onCancel]);

  return (
    <dialog
      ref={ref}
      aria-labelledby="confirm-heading"
      className="booking-dialog m-auto w-[min(100vw-2rem,26rem)] max-w-none rounded-[2px] border border-steel bg-iron p-0 text-chalk"
    >
      <div className="p-6">
        <h2
          id="confirm-heading"
          className="u-display text-[19px] font-extrabold uppercase tracking-[0.03em] text-chalk"
        >
          {title}
        </h2>
        <p className="mt-3 text-[14px] leading-relaxed text-ash">{body}</p>

        <div className="mt-7 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={onConfirm}
            disabled={busy}
            className="inline-flex min-h-11 items-center gap-2 rounded-[2px] bg-danger px-5 font-mono text-[11px] uppercase tracking-[0.16em] text-void transition-opacity hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ember disabled:opacity-60"
          >
            {busy ? <Loader2 aria-hidden="true" className="size-3.5 motion-safe:animate-spin" /> : null}
            {busy ? "Deleting" : confirmLabel}
          </button>

          <button
            type="button"
            onClick={onCancel}
            disabled={busy}
            className="inline-flex min-h-11 items-center rounded-[2px] border border-steel px-5 font-mono text-[11px] uppercase tracking-[0.16em] text-ash transition-colors hover:border-ash hover:text-chalk focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ember"
          >
            Cancel
          </button>
        </div>
      </div>
    </dialog>
  );
}

/** Shown when a table has no rows yet. */
export function EmptyState({
  icon: Icon,
  title,
  body,
}: {
  icon: React.ComponentType<{ className?: string; "aria-hidden"?: boolean }>;
  title: string;
  body: string;
}) {
  return (
    <div className="flex flex-col items-center gap-4 rounded-[2px] border border-dashed border-steel bg-iron px-6 py-16 text-center">
      <Icon aria-hidden className="size-7 text-ash" />
      <div>
        <p className="u-display text-[17px] font-extrabold uppercase tracking-[0.03em] text-chalk">
          {title}
        </p>
        <p className="mt-2 max-w-[40ch] text-[14px] leading-relaxed text-ash">{body}</p>
      </div>
    </div>
  );
}

/** Small on/off pill used for is_active and is_recommended. */
export function ActiveBadge({ active }: { active: boolean }) {
  return (
    <span
      className={cn(
        "inline-flex whitespace-nowrap rounded-[2px] border px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.16em]",
        active ? "border-success/40 bg-success/10 text-success" : "border-ash/40 bg-ash/10 text-ash",
      )}
    >
      {active ? "Live" : "Hidden"}
    </span>
  );
}

/** The standard admin action button, in two weights. */
export function AdminButton({
  children,
  variant = "ghost",
  busy,
  ...rest
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "ghost" | "danger";
  busy?: boolean;
}) {
  return (
    <button
      type="button"
      {...rest}
      className={cn(
        "inline-flex min-h-10 items-center gap-2 rounded-[2px] px-4",
        "font-mono text-[11px] uppercase tracking-[0.14em] transition-colors duration-200",
        "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ember",
        "disabled:cursor-not-allowed disabled:opacity-50",
        variant === "primary" && "bg-brass text-void hover:bg-ember",
        variant === "ghost" && "border border-steel text-ash hover:border-ash hover:text-chalk",
        variant === "danger" && "border border-danger/40 text-danger hover:bg-danger/10",
        rest.className,
      )}
    >
      {busy ? <Loader2 aria-hidden="true" className="size-3.5 motion-safe:animate-spin" /> : null}
      {children}
    </button>
  );
}
