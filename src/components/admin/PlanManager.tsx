"use client";

import { useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import { Layers, Pencil, Plus, Trash2, X } from "lucide-react";
import {
  ActiveBadge,
  AdminButton,
  ConfirmDialog,
  EmptyState,
  Toast,
} from "@/components/admin/AdminPrimitives";
import { SelectField, TextAreaField, TextField } from "@/components/ui/Field";
import { getAdminBrowserClient } from "@/lib/supabase/browser";
import { toSlug } from "@/lib/content/format";
import { site } from "@/content/site";
import { cn } from "@/lib/utils";
import type { MembershipPlanRow } from "@/lib/supabase/types";

const money = new Intl.NumberFormat("en-US");

type Draft = {
  slug: string;
  name: string;
  description: string;
  monthly_price: string;
  yearly_price: string;
  featuresText: string;
  inherits: string;
  is_recommended: boolean;
  is_active: boolean;
  sort_order: string;
};

type Errors = Partial<Record<keyof Draft, string>>;

const EMPTY: Draft = {
  slug: "",
  name: "",
  description: "",
  monthly_price: "",
  yearly_price: "",
  featuresText: "",
  inherits: "",
  is_recommended: false,
  is_active: true,
  sort_order: "0",
};

function toDraft(plan: MembershipPlanRow): Draft {
  return {
    slug: plan.slug,
    name: plan.name,
    description: plan.description,
    monthly_price: String(plan.monthly_price),
    yearly_price: String(plan.yearly_price),
    featuresText: plan.features.join("\n"),
    inherits: plan.inherits ?? "",
    is_recommended: plan.is_recommended,
    is_active: plan.is_active,
    sort_order: String(plan.sort_order),
  };
}

/** Mirrors the CHECK constraints in the migration. */
function validate(draft: Draft): Errors {
  const errors: Errors = {};
  const name = draft.name.trim();
  if (!name) errors.name = "Enter a plan name.";
  else if (name.length < 2 || name.length > 60) errors.name = "Use between 2 and 60 characters.";

  const slug = draft.slug.trim();
  if (!slug) errors.slug = "Enter a slug.";
  else if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(slug)) {
    errors.slug = "Lowercase letters, numbers and hyphens only.";
  }

  if (draft.description.length > 400) errors.description = "Keep the description under 400 characters.";

  for (const key of ["monthly_price", "yearly_price"] as const) {
    const raw = draft[key].trim();
    if (raw === "") errors[key] = "Enter a price.";
    else if (!/^\d+$/.test(raw)) errors[key] = "Whole numbers only, no commas.";
  }

  const features = draft.featuresText.split("\n").map((f) => f.trim()).filter(Boolean);
  if (features.length === 0) errors.featuresText = "Add at least one feature.";
  else if (features.length > 20) errors.featuresText = "Twenty features maximum.";

  if (!/^-?\d+$/.test(draft.sort_order.trim())) errors.sort_order = "Enter a whole number.";

  return errors;
}

export function PlanManager({ initialPlans }: { initialPlans: MembershipPlanRow[] }) {
  const router = useRouter();

  const [plans, setPlans] = useState(initialPlans);
  const [editing, setEditing] = useState<MembershipPlanRow | null>(null);
  const [draft, setDraft] = useState<Draft | null>(null);
  const [errors, setErrors] = useState<Errors>({});
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState<MembershipPlanRow | null>(null);
  const [deleteBusy, setDeleteBusy] = useState(false);
  const [toast, setToast] = useState<{ message: string; tone: "success" | "error" } | null>(null);

  const dismissToast = useCallback(() => setToast(null), []);

  function openNew() {
    setEditing(null);
    setDraft(EMPTY);
    setErrors({});
  }

  function openEdit(plan: MembershipPlanRow) {
    setEditing(plan);
    setDraft(toDraft(plan));
    setErrors({});
  }

  function closeForm() {
    setDraft(null);
    setEditing(null);
    setErrors({});
  }

  function set<K extends keyof Draft>(key: K, value: Draft[K]) {
    setDraft((current) => (current ? { ...current, [key]: value } : current));
    setErrors((current) => (current[key] ? { ...current, [key]: undefined } : current));
  }

  async function save() {
    if (!draft) return;

    const found = validate(draft);
    if (Object.keys(found).length > 0) {
      setErrors(found);
      document.getElementById(`plan-${Object.keys(found)[0]}`)?.focus();
      return;
    }

    setSaving(true);
    const supabase = getAdminBrowserClient();

    const payload = {
      slug: draft.slug.trim(),
      name: draft.name.trim(),
      description: draft.description.trim(),
      monthly_price: Number(draft.monthly_price),
      yearly_price: Number(draft.yearly_price),
      features: draft.featuresText.split("\n").map((f) => f.trim()).filter(Boolean),
      inherits: draft.inherits.trim() || null,
      is_recommended: draft.is_recommended,
      is_active: draft.is_active,
      sort_order: Number(draft.sort_order),
    };

    const query = editing
      ? supabase.from("membership_plans").update(payload).eq("id", editing.id).select("*").single()
      : supabase.from("membership_plans").insert(payload).select("*").single();

    const { data, error } = await query;
    setSaving(false);

    if (error || !data) {
      console.error("[admin] plan save failed", error);
      setToast({
        tone: "error",
        message:
          error?.code === "23505"
            ? "That slug is already used by another plan."
            : "Could not save the plan. Please try again.",
      });
      return;
    }

    // Replace or append locally so the table updates instantly, then let the
    // server component re-fetch to confirm.
    setPlans((current) => {
      const next = editing
        ? current.map((p) => (p.id === data.id ? data : p))
        : [...current, data];
      return next.sort((a, b) => a.sort_order - b.sort_order);
    });
    router.refresh();

    setToast({ tone: "success", message: editing ? "Plan updated." : "Plan created." });
    closeForm();
  }

  async function confirmDelete() {
    if (!deleting) return;
    setDeleteBusy(true);

    const supabase = getAdminBrowserClient();
    const { error } = await supabase.from("membership_plans").delete().eq("id", deleting.id);
    setDeleteBusy(false);

    if (error) {
      console.error("[admin] plan delete failed", error);
      setToast({ tone: "error", message: "Could not delete the plan. Please try again." });
      setDeleting(null);
      return;
    }

    setPlans((current) => current.filter((p) => p.id !== deleting.id));
    router.refresh();
    setToast({ tone: "success", message: `"${deleting.name}" deleted.` });
    setDeleting(null);
  }

  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="u-display text-[clamp(1.5rem,4vw,2rem)] font-extrabold uppercase leading-none text-chalk">
            Membership plans
          </h1>
          <p className="mt-3 text-[15px] text-ash">
            What visitors see in the pricing section. Hidden plans stay out of sight.
          </p>
        </div>

        <AdminButton variant="primary" onClick={openNew}>
          <Plus aria-hidden="true" className="size-3.5" />
          New plan
        </AdminButton>
      </div>

      <div className="mt-8">
        {plans.length === 0 ? (
          <EmptyState
            icon={Layers}
            title="No plans yet"
            body="Create your first membership plan and it appears on the website straight away."
          />
        ) : (
          <div className="rounded-[2px] border border-steel bg-iron">
            {/* `relative` so the sr-only text inside the action buttons is
                clipped here rather than widening the whole page. */}
            <div className="relative overflow-x-auto">
              <table className="w-full min-w-[54rem] border-collapse text-left">
                <caption className="sr-only">Membership plans, in display order.</caption>
                <thead>
                  <tr className="border-b border-steel">
                    {["Plan", "Monthly", "Yearly", "Features", "Status", ""].map((h, i) => (
                      <th
                        key={h || i}
                        scope="col"
                        className="px-5 py-4 font-mono text-[10px] font-normal uppercase tracking-[0.18em] text-ash"
                      >
                        {h || <span className="sr-only">Actions</span>}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {plans.map((plan) => (
                    <tr key={plan.id} className="border-b border-steel/60 last:border-b-0">
                      <td className="px-5 py-4">
                        <span className="flex flex-wrap items-center gap-2 text-[15px] text-chalk">
                          {plan.name}
                          {plan.is_recommended ? (
                            <span className="rounded-[2px] bg-brass px-2 py-0.5 font-mono text-[9px] uppercase tracking-[0.16em] text-void">
                              Recommended
                            </span>
                          ) : null}
                        </span>
                        <span className="mt-1 block font-mono text-[11px] text-ash">{plan.slug}</span>
                      </td>
                      <td className="whitespace-nowrap px-5 py-4 font-mono text-[13px] text-chalk">
                        {money.format(plan.monthly_price)} {site.currency.code}
                      </td>
                      <td className="whitespace-nowrap px-5 py-4 font-mono text-[13px] text-ash">
                        {money.format(plan.yearly_price)} {site.currency.code}
                      </td>
                      <td className="px-5 py-4 font-mono text-[13px] text-ash">
                        {plan.features.length}
                      </td>
                      <td className="px-5 py-4">
                        <ActiveBadge active={plan.is_active} />
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex justify-end gap-2">
                          <AdminButton onClick={() => openEdit(plan)}>
                            <Pencil aria-hidden="true" className="size-3.5" />
                            Edit
                            <span className="sr-only"> {plan.name}</span>
                          </AdminButton>
                          <AdminButton variant="danger" onClick={() => setDeleting(plan)}>
                            <Trash2 aria-hidden="true" className="size-3.5" />
                            <span className="sr-only">Delete {plan.name}</span>
                          </AdminButton>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* --- Create / edit form --- */}
      {draft ? (
        <div className="fixed inset-0 z-40 overflow-y-auto bg-void/85 backdrop-blur-sm p-4 sm:p-8">
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="plan-form-heading"
            className="mx-auto w-full max-w-[42rem] rounded-[2px] border border-steel bg-iron p-6 sm:p-8"
          >
            <div className="flex items-start justify-between gap-4">
              <h2
                id="plan-form-heading"
                className="u-display text-[22px] font-extrabold uppercase tracking-[0.03em] text-chalk"
              >
                {editing ? `Edit ${editing.name}` : "New plan"}
              </h2>
              <button
                type="button"
                onClick={closeForm}
                aria-label="Close form"
                className="inline-flex size-10 shrink-0 items-center justify-center rounded-[2px] text-ash transition-colors hover:text-chalk focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ember"
              >
                <X aria-hidden="true" className="size-5" />
              </button>
            </div>

            <div className="mt-7 grid gap-5 sm:grid-cols-2">
              <TextField
                id="plan-name"
                label="Plan name"
                value={draft.name}
                error={errors.name}
                disabled={saving}
                onChange={(e) => {
                  set("name", e.target.value);
                  // Only auto-fill the slug for new plans — changing it later
                  // would orphan every booking made against the old value.
                  if (!editing) set("slug", toSlug(e.target.value));
                }}
              />
              <TextField
                id="plan-slug"
                label="Slug"
                value={draft.slug}
                error={errors.slug}
                disabled={saving || Boolean(editing)}
                onChange={(e) => set("slug", e.target.value)}
              />
              <TextField
                id="plan-monthly_price"
                label={`Monthly price (${site.currency.code})`}
                inputMode="numeric"
                value={draft.monthly_price}
                error={errors.monthly_price}
                disabled={saving}
                onChange={(e) => set("monthly_price", e.target.value)}
              />
              <TextField
                id="plan-yearly_price"
                label={`Yearly price, per month (${site.currency.code})`}
                inputMode="numeric"
                value={draft.yearly_price}
                error={errors.yearly_price}
                disabled={saving}
                onChange={(e) => set("yearly_price", e.target.value)}
              />
            </div>

            <div className="mt-5">
              <TextAreaField
                id="plan-description"
                label="Description"
                rows={2}
                value={draft.description}
                error={errors.description}
                disabled={saving}
                onChange={(e) => set("description", e.target.value)}
              />
            </div>

            <div className="mt-5">
              <TextAreaField
                id="plan-featuresText"
                label="Features — one per line"
                rows={5}
                value={draft.featuresText}
                error={errors.featuresText}
                disabled={saving}
                onChange={(e) => set("featuresText", e.target.value)}
              />
            </div>

            <div className="mt-5 grid gap-5 sm:grid-cols-2">
              <TextField
                id="plan-inherits"
                label='Builds on plan'
                optional
                placeholder="e.g. Basic"
                value={draft.inherits}
                disabled={saving}
                onChange={(e) => set("inherits", e.target.value)}
              />
              <TextField
                id="plan-sort_order"
                label="Display order"
                inputMode="numeric"
                value={draft.sort_order}
                error={errors.sort_order}
                disabled={saving}
                onChange={(e) => set("sort_order", e.target.value)}
              />
            </div>

            <div className="mt-6 flex flex-col gap-3">
              {[
                { key: "is_recommended" as const, label: "Mark as recommended", hint: "Shown as the dark, highlighted card." },
                { key: "is_active" as const, label: "Visible on the website", hint: "Turn off to hide without deleting." },
              ].map(({ key, label, hint }) => (
                <label key={key} className="flex cursor-pointer items-start gap-3">
                  <input
                    type="checkbox"
                    checked={draft[key]}
                    disabled={saving}
                    onChange={(e) => set(key, e.target.checked)}
                    className="mt-1 size-4 accent-[var(--color-brass)]"
                  />
                  <span>
                    <span className="block font-mono text-[11px] uppercase tracking-[0.14em] text-chalk">
                      {label}
                    </span>
                    <span className="mt-1 block text-[13px] text-ash">{hint}</span>
                  </span>
                </label>
              ))}
            </div>

            <div className={cn("mt-8 flex flex-wrap gap-3")}>
              <AdminButton variant="primary" busy={saving} disabled={saving} onClick={save}>
                {saving ? "Saving" : editing ? "Save changes" : "Create plan"}
              </AdminButton>
              <AdminButton onClick={closeForm} disabled={saving}>
                Cancel
              </AdminButton>
            </div>
          </div>
        </div>
      ) : null}

      <ConfirmDialog
        open={deleting !== null}
        title="Delete this plan?"
        body={`"${deleting?.name ?? ""}" will be removed from the website immediately. Existing bookings keep their record. This cannot be undone.`}
        busy={deleteBusy}
        onConfirm={confirmDelete}
        onCancel={() => setDeleting(null)}
      />

      {toast ? <Toast message={toast.message} tone={toast.tone} onDismiss={dismissToast} /> : null}
    </>
  );
}
