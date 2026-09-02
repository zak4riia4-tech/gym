"use server";

import { getPublicSupabase } from "@/lib/supabase/public";
import { validateBooking, type BookingFormValues } from "@/lib/validation";

/*
 * Booking submission runs on the SERVER.
 *
 * Two reasons, both real:
 *
 * 1. Size. Doing this in the browser meant shipping the whole Supabase client
 *    to every visitor — about 77 KB of JavaScript — so that one row could be
 *    inserted. A server action moves all of it off the public bundle.
 *
 * 2. Trust. Browser validation is a courtesy to the person filling the form;
 *    it stops nothing. Re-checking here means a crafted request has to get
 *    past the same rules, and the database CHECK constraints behind them.
 *
 * The anon key is still what talks to Postgres, so Row Level Security applies
 * exactly as before: insert a pending booking, nothing else.
 */

export type BookingActionResult = { ok: true } | { ok: false; message: string };

export async function submitBooking(
  values: BookingFormValues,
): Promise<BookingActionResult> {
  // Which plans are genuinely on sale right now — read here rather than
  // trusted from the browser, so a stale or edited page cannot book a plan
  // that has been withdrawn.
  const supabase = getPublicSupabase();

  const { data: plans, error: plansError } = await supabase
    .from("membership_plans")
    .select("slug")
    .eq("is_active", true);

  if (plansError) {
    console.error("[booking] could not load plans for validation", plansError);
    return { ok: false, message: "Could not reach the gym's server. Please try again." };
  }

  const validSlugs = (plans ?? []).map((p) => p.slug);
  const errors = validateBooking(values, validSlugs);

  if (Object.keys(errors).length > 0) {
    // The browser already showed field-level errors, so reaching here means
    // the request did not come from our form.
    return { ok: false, message: "Some details were not accepted. Please check the form." };
  }

  const { error } = await supabase.from("bookings").insert({
    full_name: values.fullName.trim(),
    email: values.email.trim(),
    phone_number: values.phoneNumber.trim(),
    membership_plan: values.membershipPlan,
    preferred_start_date: values.preferredStartDate,
    fitness_goal: values.fitnessGoal.trim() || null,
    message: values.message.trim() || null,
  });

  if (error) {
    console.error("[booking] insert failed", error);

    // The database rate-limit trigger. Its message is deliberately vague to a
    // script but useful to a person who genuinely sent a second request.
    if (error.message?.includes("booking_rate_limit")) {
      return {
        ok: false,
        message:
          "We already have a request from these details today. A coach will call you — no need to send another.",
      };
    }
    if (error.code === "23514") {
      return { ok: false, message: "The gym's system rejected one of your details. Please review the form." };
    }
    if (error.code === "42501") {
      return { ok: false, message: "Bookings are not being accepted right now. Please call us instead." };
    }
    return { ok: false, message: "Something went wrong sending your request. Please try again, or call us." };
  }

  return { ok: true };
}
