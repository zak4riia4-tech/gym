import { createBrowserClient } from "@supabase/ssr";
import type { Database } from "./types";

/*
 * Browser client for the ADMIN area — the only Supabase client that reaches
 * a visitor's browser, and it only loads on /admin pages.
 *
 * It keeps the signed-in session in cookies rather than localStorage, which is
 * what lets the Next.js server read the session too. A localStorage session
 * would be invisible to the server, so every protected page would have to be
 * rendered on the client and the guard would be trivially bypassable.
 *
 * The public site uses lib/supabase/public.ts on the server instead, so none
 * of this ships to ordinary visitors.
 */
let cached: ReturnType<typeof createBrowserClient<Database>> | undefined;

export function getAdminBrowserClient() {
  if (!cached) {
    cached = createBrowserClient<Database>(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    );
  }
  return cached;
}
