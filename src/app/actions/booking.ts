"use server";

import { getPublicSupabase } from "@/lib/supabase/public";
import { validateBooking, type BookingFormValues } from "@/lib/validation";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { defaultLocale, isLocale } from "@/lib/i18n/config";

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
  /* The visitor's language, so a failure comes back in the language they are
     reading rather than always in English. */
  localeInput: string = defaultLocale,
): Promise<BookingActionResult> {
  const locale = isLocale(localeInput) ? localeInput : defaultLocale;
  const m = getDictionary(locale).booking.errors;
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
    return { ok: false, message: m.unreachable };
  }

  const validSlugs = (plans ?? []).map((p) => p.slug);
  const errors = validateBooking(values, validSlugs, m);

  if (Object.keys(errors).length > 0) {
    // The browser already showed field-level errors, so reaching here means
    // the request did not come from our form.
    return { ok: false, message: m.notAccepted };
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
      return { ok: false, message: m.rateLimited };
    }
    if (error.code === "23514") {
      return { ok: false, message: m.rejected };
    }
    if (error.code === "42501") {
      return { ok: false, message: m.closed };
    }
    return { ok: false, message: m.generic };
  }

  return { ok: true };
}
