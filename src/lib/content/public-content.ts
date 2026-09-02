import { cache } from "react";
import { getPublicSupabase } from "@/lib/supabase/public";
import type { MembershipPlanRow, TrainerRow } from "@/lib/supabase/types";

/*
 * Reads for the public website.
 *
 * The `is_active` filter here is convenience, not security — the anon RLS
 * policy already refuses inactive rows. Both layers agree on purpose: if the
 * filter were ever dropped, the database would still hold the line.
 */

/* cache() memoises per request, so the Hero and the Membership section asking
   for plans in the same render produces ONE database round trip, not two. */
export const getActivePlans = cache(async (): Promise<MembershipPlanRow[]> => {
  const { data, error } = await getPublicSupabase()
    .from("membership_plans")
    .select("*")
    .eq("is_active", true)
    .order("sort_order", { ascending: true });

  if (error) {
    console.error("[public] could not load membership plans", error);
    return [];
  }
  return data ?? [];
});

export const getActiveTrainers = cache(async (): Promise<TrainerRow[]> => {
  const { data, error } = await getPublicSupabase()
    .from("trainers")
    .select("*")
    .eq("is_active", true)
    .order("sort_order", { ascending: true });

  if (error) {
    console.error("[public] could not load trainers", error);
    return [];
  }
  return data ?? [];
});
