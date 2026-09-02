import type { Metadata } from "next";
import { AdminContentShell } from "@/components/admin/AdminContentShell";
import { TrainerManager } from "@/components/admin/TrainerManager";
import { requireAdmin } from "@/lib/admin/guard";
import type { TrainerRow } from "@/lib/supabase/types";

export const metadata: Metadata = {
  title: "Trainers",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function AdminTrainersPage() {
  const { supabase, user } = await requireAdmin();

  const { data, error } = await supabase
    .from("trainers")
    .select("*")
    .order("sort_order", { ascending: true });

  return (
    <AdminContentShell email={user.email ?? "Staff"} current="/admin/trainers">
      {error ? (
        <p
          role="alert"
          className="rounded-[2px] border border-danger/40 bg-danger/10 px-4 py-3 text-[14px] text-danger"
        >
          Could not load trainers. Reload the page and try again.
        </p>
      ) : (
        <TrainerManager initialTrainers={(data ?? []) as TrainerRow[]} />
      )}
    </AdminContentShell>
  );
}
