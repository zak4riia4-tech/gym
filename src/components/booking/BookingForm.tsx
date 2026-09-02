"use client";

import { useState } from "react";
import { ArrowRight, Check, Loader2, TriangleAlert } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { SelectField, TextAreaField, TextField } from "@/components/ui/Field";
import { submitBooking } from "@/app/actions/booking";
import {
  EMPTY_BOOKING_FORM,
  todayIso,
  validateBooking,
  type BookingFormErrors,
  type BookingFormValues,
} from "@/lib/validation";
import { useI18n } from "@/lib/i18n/context";
import type { PlanId } from "@/content/site";
import type { MembershipPlanRow } from "@/lib/supabase/types";

/** idle -> submitting -> success | error. Drives every visual state below. */
type SubmitState = "idle" | "submitting" | "success" | "error";

type BookingFormProps = {
  /** Pre-selects the plan the visitor clicked on a membership card. */
  initialPlan: PlanId | "";
  plans: MembershipPlanRow[];
  onDone: () => void;
};

export function BookingForm({ initialPlan, plans, onDone }: BookingFormProps) {
  const { locale, dict } = useI18n();
  const booking = dict.booking;
  const [values, setValues] = useState<BookingFormValues>({
    ...EMPTY_BOOKING_FORM,
    membershipPlan: initialPlan,
  });
  const [errors, setErrors] = useState<BookingFormErrors>({});
  const [state, setState] = useState<SubmitState>("idle");
  const [failureMessage, setFailureMessage] = useState("");

  const submitting = state === "submitting";

  function update<K extends keyof BookingFormValues>(key: K, value: BookingFormValues[K]) {
    setValues((current) => ({ ...current, [key]: value }));
    // Clear a field's error as soon as the visitor starts fixing it.
    setErrors((current) => (current[key] ? { ...current, [key]: undefined } : current));
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    // 1. Validate in the browser. Nothing is sent if anything is wrong.
    const found = validateBooking(values, plans.map((p) => p.slug), booking.errors);
    if (Object.keys(found).length > 0) {
      setErrors(found);
      setState("idle");
      // Move focus to the first problem so keyboard users are not stranded.
      const firstKey = Object.keys(found)[0];
      document.getElementById("booking-" + firstKey)?.focus();
      return;
    }

    // 2. Show the loading state.
    setErrors({});
    setFailureMessage("");
    setState("submitting");

    // 3. Send it to the server action, which re-validates and writes the row.
    //    Nothing about Supabase is bundled into this page as a result.
    const result = await submitBooking(values, locale);

    // 4. Report honestly. A failure is never dressed up as a success.
    if (!result.ok) {
      setFailureMessage(result.message);
      setState("error");
      return;
    }

    // 5. Succeeded: reset the fields and show confirmation.
    setValues({ ...EMPTY_BOOKING_FORM, membershipPlan: initialPlan });
    setState("success");
  }

  if (state === "success") {
    return (
      <div className="flex flex-col items-start gap-5 py-4">
        <span className="inline-flex size-12 items-center justify-center rounded-[2px] border border-brass/50 bg-brass/10 text-brass">
          <Check aria-hidden="true" className="size-6" />
        </span>

        <div>
          <h3 className="u-display text-[22px] font-extrabold uppercase tracking-[0.03em] text-chalk">
            {booking.successTitle}
          </h3>
          <p className="mt-3 max-w-[46ch] text-[15px] leading-relaxed text-ash">
            {booking.successBody}
          </p>
        </div>

        {/* The dialog stays open until the visitor dismisses it, so the
            confirmation cannot be missed. */}
        <Button variant="primary" tone="dark" onClick={onDone} className="mt-2">
          {booking.successClose}
        </Button>
      </div>
    );
  }

  return (
    <form noValidate onSubmit={handleSubmit} className="flex flex-col gap-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <TextField
          id="booking-fullName"
          label={booking.fields.fullName}
          name="fullName"
          autoComplete="name"
          value={values.fullName}
          error={errors.fullName}
          disabled={submitting}
          onChange={(e) => update("fullName", e.target.value)}
        />

        <TextField
          id="booking-email"
          label={booking.fields.email}
          name="email"
          type="email"
          inputMode="email"
          autoComplete="email"
          value={values.email}
          error={errors.email}
          disabled={submitting}
          onChange={(e) => update("email", e.target.value)}
        />

        <TextField
          id="booking-phoneNumber"
          label={booking.fields.phoneNumber}
          name="phoneNumber"
          type="tel"
          inputMode="tel"
          autoComplete="tel"
          placeholder="0750 123 4567"
          value={values.phoneNumber}
          error={errors.phoneNumber}
          disabled={submitting}
          onChange={(e) => update("phoneNumber", e.target.value)}
        />

        <TextField
          id="booking-preferredStartDate"
          label={booking.fields.preferredStartDate}
          name="preferredStartDate"
          type="date"
          min={todayIso()}
          value={values.preferredStartDate}
          error={errors.preferredStartDate}
          disabled={submitting}
          onChange={(e) => update("preferredStartDate", e.target.value)}
        />

        <SelectField
          id="booking-membershipPlan"
          label={booking.fields.membershipPlan}
          name="membershipPlan"
          value={values.membershipPlan}
          error={errors.membershipPlan}
          disabled={submitting}
          onChange={(e) => update("membershipPlan", e.target.value as PlanId)}
        >
          <option value="">{booking.selectPlaceholder}</option>
          {plans.map((plan) => (
            <option key={plan.id} value={plan.slug}>
              {plan.name}
            </option>
          ))}
        </SelectField>

        <SelectField
          id="booking-fitnessGoal"
          label={booking.fields.fitnessGoal}
          name="fitnessGoal"
          optional
          optionalLabel={booking.optional}
          value={values.fitnessGoal}
          error={errors.fitnessGoal}
          disabled={submitting}
          onChange={(e) => update("fitnessGoal", e.target.value)}
        >
          <option value="">{booking.selectPlaceholder}</option>
          {booking.goals.map((goal) => (
            <option key={goal} value={goal}>
              {goal}
            </option>
          ))}
        </SelectField>
      </div>

      <TextAreaField
        id="booking-message"
        label={booking.fields.message}
        name="message"
        optional
        rows={3}
        placeholder={booking.messagePlaceholder}
        value={values.message}
        error={errors.message}
        disabled={submitting}
        onChange={(e) => update("message", e.target.value)}
      />

      {/* The real reason the request failed, never a fake success. */}
      {state === "error" && failureMessage ? (
        <p
          role="alert"
          className="flex items-start gap-3 rounded-[2px] border border-danger/40 bg-danger/10 px-4 py-3 text-[14px] leading-snug text-danger"
        >
          <TriangleAlert aria-hidden="true" className="mt-0.5 size-4 shrink-0" />
          {failureMessage}
        </p>
      ) : null}

      <Button
        type="submit"
        variant="primary"
        tone="dark"
        disabled={submitting}
        className="mt-1 w-full sm:w-auto sm:self-start"
      >
        {submitting ? booking.submitting : booking.submit}
        {submitting ? (
          <Loader2 aria-hidden="true" className="size-4 motion-safe:animate-spin" />
        ) : (
          <ArrowRight
            aria-hidden="true"
            className="size-4 transition-transform duration-300 ease-out-soft group-hover/btn:translate-x-1"
          />
        )}
      </Button>
    </form>
  );
}
