import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "./types";

/*
 * Anonymous server client for PUBLIC page data.
 *
 * Deliberately session-less. If we reused the cookie-aware admin client here,
 * a signed-in owner browsing their own website would see deactivated plans and
 * retired trainers that no visitor can see — the page would lie to them about
 * what the public actually gets. This client is always the public's view.
 *
 * Built LAZILY, on the first call rather than when this file is imported.
 * `next build` evaluates every module to collect route configuration, so a
 * client created at module scope runs during the build — and a missing
 * environment variable then fails the whole deployment with an error that
 * points at this file rather than at the real cause. Deferring construction
 * keeps the build honest: it succeeds, and a misconfiguration surfaces at
 * request time with a message that says what to do about it.
 */
let cached: SupabaseClient<Database> | undefined;

export function getPublicSupabase(): SupabaseClient<Database> {
  if (cached) return cached;

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    throw new Error(
      "Supabase is not configured. Set NEXT_PUBLIC_SUPABASE_URL and " +
        "NEXT_PUBLIC_SUPABASE_ANON_KEY. Locally these live in .env.local; on " +
        "Vercel add them under Project Settings -> Environment Variables, then redeploy.",
    );
  }

  cached = createClient<Database>(url, anonKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  return cached;
}
