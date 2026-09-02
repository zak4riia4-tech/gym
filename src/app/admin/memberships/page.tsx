import type { Metadata } from "next";
import { AdminContentShell } from "@/components/admin/AdminContentShell";
import { PlanManager } from "@/components/admin/PlanManager";
import { requireAdmin } from "@/lib/admin/guard";
import type { MembershipPlanRow } from "@/lib/supabase/types";

export const metadata: Metadata = {
  title: "Membership plans",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function AdminMembershipsPage() {
  const { supabase, user } = await requireAdmin();

  // Admins see every plan, including hidden ones — that is the whole point of
  // the admin policy being wider than the public one.
  const { data, error } = await supabase
    .from("membership_plans")
    .select("*")
    .order("sort_order", { ascending: true });

  return (
    <AdminContentShell email={user.email ?? "Staff"} current="/admin/memberships">
      {error ? (
        <p
          role="alert"
          className="rounded-[2px] border border-danger/40 bg-danger/10 px-4 py-3 text-[14px] text-danger"
        >
          Could not load membership plans. Reload the page and try again.
        </p>
      ) : (
        <PlanManager initialPlans={(data ?? []) as MembershipPlanRow[]} />
      )}
    </AdminContentShell>
  );
}
