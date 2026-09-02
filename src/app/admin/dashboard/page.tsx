import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { ShieldAlert } from "lucide-react";
import { AdminShell } from "@/components/admin/AdminShell";
import { getAdminServerClient } from "@/lib/supabase/server";
import type { BookingRow } from "@/lib/supabase/types";

export const metadata: Metadata = {
  title: "Bookings",
  robots: { index: false, follow: false },
};

// Bookings change constantly, so never serve this from a cache.
export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const supabase = await getAdminServerClient();

  // Gate 1 — is there a real session? getUser() verifies the token with
  // Supabase rather than trusting whatever the cookie claims.
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/admin/login");

  // Gate 2 — being signed in is not being authorised. Ask the database.
  const { data: isAdmin } = await supabase.rpc("is_admin");

  if (!isAdmin) {
    return (
      <main className="flex min-h-dvh items-center justify-center bg-void px-6">
        <div className="max-w-[34rem] rounded-[2px] border border-steel bg-iron p-8 text-center">
          <ShieldAlert aria-hidden="true" className="mx-auto size-7 text-danger" />
          <h1 className="u-display mt-5 text-[22px] font-extrabold uppercase tracking-[0.03em] text-chalk">
            No dashboard access
          </h1>
          <p className="mt-3 text-[15px] leading-relaxed text-ash">
            You are signed in as {user.email}, but this account is not on the
            staff list. Ask the site administrator to add it.
          </p>
          <a
            href="/admin/login"
            className="mt-7 inline-flex min-h-11 items-center rounded-[2px] border border-chalk/25 px-5 font-mono text-[11px] uppercase tracking-[0.16em] text-chalk transition-colors duration-200 hover:bg-chalk hover:text-void focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ember"
          >
            Back to sign in
          </a>
        </div>
      </main>
    );
  }

  // Gate 3 — Row Level Security. Even if the two checks above were bypassed,
  // this query returns nothing unless the database agrees this user is staff.
  const { data, error } = await supabase
    .from("bookings")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("[admin] could not load bookings", error);
    return (
      <main className="flex min-h-dvh items-center justify-center bg-void px-6">
        <div className="max-w-[34rem] rounded-[2px] border border-danger/40 bg-danger/10 p-8 text-center">
          <ShieldAlert aria-hidden="true" className="mx-auto size-7 text-danger" />
          <h1 className="u-display mt-5 text-[22px] font-extrabold uppercase tracking-[0.03em] text-chalk">
            Could not load bookings
          </h1>
          <p className="mt-3 text-[15px] leading-relaxed text-ash">
            The database did not respond as expected. Reload the page, and if it
            keeps happening check the Supabase project status.
          </p>
        </div>
      </main>
    );
  }

  return <AdminShell email={user.email ?? "Staff"} initialBookings={(data ?? []) as BookingRow[]} />;
}
