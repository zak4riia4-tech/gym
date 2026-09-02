"use client";

import { useCallback, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { ImageUp, Pencil, Plus, Trash2, Users, X } from "lucide-react";
import {
  ActiveBadge,
  AdminButton,
  ConfirmDialog,
  EmptyState,
  Toast,
} from "@/components/admin/AdminPrimitives";
import { TextAreaField, TextField } from "@/components/ui/Field";
import { getAdminBrowserClient } from "@/lib/supabase/browser";
import type { TrainerRow } from "@/lib/supabase/types";

const BUCKET = "trainer-images";
const MAX_BYTES = 5 * 1024 * 1024;
const ALLOWED = ["image/jpeg", "image/png", "image/webp", "image/avif"];

type Draft = {
  full_name: string;
  specialty: string;
  bio: string;
  experience: string;
  certification: string;
  image_url: string;
  instagram_url: string;
  facebook_url: string;
  is_active: boolean;
  sort_order: string;
};

type Errors = Partial<Record<keyof Draft, string>>;

const EMPTY: Draft = {
  full_name: "",
  specialty: "",
  bio: "",
  experience: "",
  certification: "",
  image_url: "",
  instagram_url: "",
  facebook_url: "",
  is_active: true,
  sort_order: "0",
};

function toDraft(t: TrainerRow): Draft {
  return {
    full_name: t.full_name,
    specialty: t.specialty,
    bio: t.bio,
    experience: t.experience,
    certification: t.certification ?? "",
    image_url: t.image_url ?? "",
    instagram_url: t.instagram_url ?? "",
    facebook_url: t.facebook_url ?? "",
    is_active: t.is_active,
    sort_order: String(t.sort_order),
  };
}

function validate(draft: Draft): Errors {
  const errors: Errors = {};
  const name = draft.full_name.trim();
  if (!name) errors.full_name = "Enter the trainer's name.";
  else if (name.length < 2 || name.length > 80) errors.full_name = "Use between 2 and 80 characters.";

  const specialty = draft.specialty.trim();
  if (!specialty) errors.specialty = "Enter a specialty.";
  else if (specialty.length > 60) errors.specialty = "Keep it under 60 characters.";

  if (draft.bio.length > 600) errors.bio = "Keep the bio under 600 characters.";
  if (draft.experience.length > 40) errors.experience = "Keep this short, e.g. \"8 years\".";

  for (const key of ["instagram_url", "facebook_url"] as const) {
    const value = draft[key].trim();
    if (value && !/^https?:\/\//i.test(value)) {
      errors[key] = "Must start with https://";
    }
  }

  if (!/^-?\d+$/.test(draft.sort_order.trim())) errors.sort_order = "Enter a whole number.";
  return errors;
}

export function TrainerManager({ initialTrainers }: { initialTrainers: TrainerRow[] }) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [trainers, setTrainers] = useState(initialTrainers);
  const [editing, setEditing] = useState<TrainerRow | null>(null);
  const [draft, setDraft] = useState<Draft | null>(null);
  const [errors, setErrors] = useState<Errors>({});
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  /** Local object URL so the admin sees the photo before anything is saved. */
  const [preview, setPreview] = useState<string | null>(null);
  const [pendingFile, setPendingFile] = useState<File | null>(null);
  const [deleting, setDeleting] = useState<TrainerRow | null>(null);
  const [deleteBusy, setDeleteBusy] = useState(false);
  const [toast, setToast] = useState<{ message: string; tone: "success" | "error" } | null>(null);

  const dismissToast = useCallback(() => setToast(null), []);

  function resetImageState() {
    if (preview) URL.revokeObjectURL(preview);
    setPreview(null);
    setPendingFile(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  function openNew() {
    setEditing(null);
    setDraft(EMPTY);
    setErrors({});
    resetImageState();
  }

  function openEdit(trainer: TrainerRow) {
    setEditing(trainer);
    setDraft(toDraft(trainer));
    setErrors({});
    resetImageState();
  }

  function closeForm() {
    setDraft(null);
    setEditing(null);
    setErrors({});
    resetImageState();
  }

  function set<K extends keyof Draft>(key: K, value: Draft[K]) {
    setDraft((current) => (current ? { ...current, [key]: value } : current));
    setErrors((current) => (current[key] ? { ...current, [key]: undefined } : current));
  }

  /**
   * Step 1 of the image flow: the file is only held in memory and shown as a
   * preview. Nothing is uploaded until Save, so cancelling leaves no orphans
   * in storage.
   */
  function handleFilePicked(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!ALLOWED.includes(file.type)) {
      setToast({ tone: "error", message: "Choose a JPEG, PNG, WebP or AVIF image." });
      event.target.value = "";
      return;
    }
    if (file.size > MAX_BYTES) {
      setToast({ tone: "error", message: "That image is over 5 MB. Choose a smaller one." });
      event.target.value = "";
      return;
    }

    if (preview) URL.revokeObjectURL(preview);
    setPendingFile(file);
    setPreview(URL.createObjectURL(file));
  }

  /**
   * Step 2: on save, push the bytes to Supabase Storage and keep only the
   * public URL. The upload uses the same anon key as everything else — Row
   * Level Security on storage.objects is what permits it, so no secret key
   * ever reaches the browser.
   */
  async function uploadImage(): Promise<string | null> {
    if (!pendingFile) return draft?.image_url.trim() || null;

    const supabase = getAdminBrowserClient();
    const extension = pendingFile.name.split(".").pop()?.toLowerCase() ?? "jpg";
    const path = `${crypto.randomUUID()}.${extension}`;

    const { error } = await supabase.storage.from(BUCKET).upload(path, pendingFile, {
      cacheControl: "3600",
      contentType: pendingFile.type,
    });

    if (error) {
      console.error("[admin] image upload failed", error);
      setToast({ tone: "error", message: "Could not upload the image. Please try again." });
      return null;
    }

    const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
    return data.publicUrl;
  }

  async function save() {
    if (!draft) return;

    const found = validate(draft);
    if (Object.keys(found).length > 0) {
      setErrors(found);
      document.getElementById(`trainer-${Object.keys(found)[0]}`)?.focus();
      return;
    }

    setSaving(true);
    setUploading(Boolean(pendingFile));

    const imageUrl = await uploadImage();
    setUploading(false);

    // uploadImage returns null only when an upload was attempted and failed.
    if (pendingFile && !imageUrl) {
      setSaving(false);
      return;
    }

    const supabase = getAdminBrowserClient();
    const payload = {
      full_name: draft.full_name.trim(),
      specialty: draft.specialty.trim(),
      bio: draft.bio.trim(),
      experience: draft.experience.trim(),
      certification: draft.certification.trim() || null,
      image_url: imageUrl,
      instagram_url: draft.instagram_url.trim() || null,
      facebook_url: draft.facebook_url.trim() || null,
      is_active: draft.is_active,
      sort_order: Number(draft.sort_order),
    };

    const query = editing
      ? supabase.from("trainers").update(payload).eq("id", editing.id).select("*").single()
      : supabase.from("trainers").insert(payload).select("*").single();

    const { data, error } = await query;
    setSaving(false);

    if (error || !data) {
      console.error("[admin] trainer save failed", error);
      setToast({ tone: "error", message: "Could not save the trainer. Please try again." });
      return;
    }

    setTrainers((current) => {
      const next = editing ? current.map((t) => (t.id === data.id ? data : t)) : [...current, data];
      return next.sort((a, b) => a.sort_order - b.sort_order);
    });
    router.refresh();

    setToast({ tone: "success", message: editing ? "Trainer updated." : "Trainer added." });
    closeForm();
  }

  async function confirmDelete() {
    if (!deleting) return;
    setDeleteBusy(true);

    const supabase = getAdminBrowserClient();
    const { error } = await supabase.from("trainers").delete().eq("id", deleting.id);
    setDeleteBusy(false);

    if (error) {
      console.error("[admin] trainer delete failed", error);
      setToast({ tone: "error", message: "Could not delete the trainer. Please try again." });
      setDeleting(null);
      return;
    }

    setTrainers((current) => current.filter((t) => t.id !== deleting.id));
    router.refresh();
    setToast({ tone: "success", message: `${deleting.full_name} removed.` });
    setDeleting(null);
  }

  const shownImage = preview ?? (draft?.image_url || null);

  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="u-display text-[clamp(1.5rem,4vw,2rem)] font-extrabold uppercase leading-none text-chalk">
            Trainers
          </h1>
          <p className="mt-3 text-[15px] text-ash">
            The coaching staff shown on the website. Hidden trainers stay out of sight.
          </p>
        </div>

        <AdminButton variant="primary" onClick={openNew}>
          <Plus aria-hidden="true" className="size-3.5" />
          New trainer
        </AdminButton>
      </div>

      <div className="mt-8">
        {trainers.length === 0 ? (
          <EmptyState
            icon={Users}
            title="No trainers yet"
            body="Add your coaching staff and they appear in the trainers section of the website."
          />
        ) : (
          <div className="rounded-[2px] border border-steel bg-iron">
            {/* `relative` so the sr-only text inside the action buttons is
                clipped here rather than widening the whole page. */}
            <div className="relative overflow-x-auto">
              <table className="w-full min-w-[50rem] border-collapse text-left">
                <caption className="sr-only">Trainers, in display order.</caption>
                <thead>
                  <tr className="border-b border-steel">
                    {["Photo", "Name", "Specialty", "Experience", "Status", ""].map((h, i) => (
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
                  {trainers.map((trainer) => (
                    <tr key={trainer.id} className="border-b border-steel/60 last:border-b-0">
                      <td className="px-5 py-3">
                        <div className="relative size-12 overflow-hidden rounded-[2px] bg-void">
                          {trainer.image_url ? (
                            <Image
                              src={trainer.image_url}
                              alt=""
                              fill
                              sizes="48px"
                              className="object-cover"
                            />
                          ) : null}
                        </div>
                      </td>
                      <td className="px-5 py-4 text-[15px] text-chalk">{trainer.full_name}</td>
                      <td className="px-5 py-4 text-[14px] text-ash">{trainer.specialty}</td>
                      <td className="whitespace-nowrap px-5 py-4 font-mono text-[13px] text-ash">
                        {trainer.experience || "—"}
                      </td>
                      <td className="px-5 py-4">
                        <ActiveBadge active={trainer.is_active} />
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex justify-end gap-2">
                          <AdminButton onClick={() => openEdit(trainer)}>
                            <Pencil aria-hidden="true" className="size-3.5" />
                            Edit
                            <span className="sr-only"> {trainer.full_name}</span>
                          </AdminButton>
                          <AdminButton variant="danger" onClick={() => setDeleting(trainer)}>
                            <Trash2 aria-hidden="true" className="size-3.5" />
                            <span className="sr-only">Delete {trainer.full_name}</span>
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

      {draft ? (
        <div className="fixed inset-0 z-40 overflow-y-auto bg-void/85 p-4 backdrop-blur-sm sm:p-8">
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="trainer-form-heading"
            className="mx-auto w-full max-w-[42rem] rounded-[2px] border border-steel bg-iron p-6 sm:p-8"
          >
            <div className="flex items-start justify-between gap-4">
              <h2
                id="trainer-form-heading"
                className="u-display text-[22px] font-extrabold uppercase tracking-[0.03em] text-chalk"
              >
                {editing ? `Edit ${editing.full_name}` : "New trainer"}
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

            {/* --- Photo --- */}
            <div className="mt-7 flex flex-wrap items-start gap-5">
              <div className="relative aspect-3/4 w-28 shrink-0 overflow-hidden rounded-[2px] border border-steel bg-void">
                {shownImage ? (
                  // A blob: preview is not a remote URL, so plain <img> is correct
                  // here; next/image only optimises configured remote hosts.
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={shownImage} alt="" className="size-full object-cover" />
                ) : (
                  <span className="flex size-full items-center justify-center font-mono text-[10px] uppercase tracking-[0.14em] text-ash">
                    No photo
                  </span>
                )}
              </div>

              <div className="min-w-[12rem] flex-1">
                <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-ash">
                  Trainer photo
                </p>
                <p className="mt-2 text-[13px] leading-relaxed text-ash">
                  JPEG, PNG, WebP or AVIF, up to 5 MB. Portrait images work best.
                  Nothing is uploaded until you save.
                </p>

                <input
                  ref={fileInputRef}
                  id="trainer-image_url"
                  type="file"
                  accept={ALLOWED.join(",")}
                  onChange={handleFilePicked}
                  disabled={saving}
                  className="sr-only"
                />
                <div className="mt-4 flex flex-wrap gap-2">
                  <AdminButton onClick={() => fileInputRef.current?.click()} disabled={saving}>
                    <ImageUp aria-hidden="true" className="size-3.5" />
                    {shownImage ? "Replace photo" : "Choose photo"}
                  </AdminButton>
                  {pendingFile ? (
                    <AdminButton onClick={resetImageState} disabled={saving}>
                      Undo
                    </AdminButton>
                  ) : null}
                </div>
              </div>
            </div>

            <div className="mt-7 grid gap-5 sm:grid-cols-2">
              <TextField
                id="trainer-full_name"
                label="Full name"
                value={draft.full_name}
                error={errors.full_name}
                disabled={saving}
                onChange={(e) => set("full_name", e.target.value)}
              />
              <TextField
                id="trainer-specialty"
                label="Specialty"
                placeholder="Strength Coach"
                value={draft.specialty}
                error={errors.specialty}
                disabled={saving}
                onChange={(e) => set("specialty", e.target.value)}
              />
              <TextField
                id="trainer-experience"
                label="Experience"
                placeholder="8 years"
                value={draft.experience}
                error={errors.experience}
                disabled={saving}
                onChange={(e) => set("experience", e.target.value)}
              />
              <TextField
                id="trainer-certification"
                label="Certification"
                optional
                placeholder="NASM-CPT"
                value={draft.certification}
                disabled={saving}
                onChange={(e) => set("certification", e.target.value)}
              />
            </div>

            <div className="mt-5">
              <TextAreaField
                id="trainer-bio"
                label="Short bio"
                rows={3}
                value={draft.bio}
                error={errors.bio}
                disabled={saving}
                onChange={(e) => set("bio", e.target.value)}
              />
            </div>

            <div className="mt-5 grid gap-5 sm:grid-cols-2">
              <TextField
                id="trainer-instagram_url"
                label="Instagram URL"
                optional
                placeholder="https://instagram.com/…"
                value={draft.instagram_url}
                error={errors.instagram_url}
                disabled={saving}
                onChange={(e) => set("instagram_url", e.target.value)}
              />
              <TextField
                id="trainer-facebook_url"
                label="Facebook URL"
                optional
                placeholder="https://facebook.com/…"
                value={draft.facebook_url}
                error={errors.facebook_url}
                disabled={saving}
                onChange={(e) => set("facebook_url", e.target.value)}
              />
            </div>

            <div className="mt-5 grid gap-5 sm:grid-cols-2">
              <TextField
                id="trainer-sort_order"
                label="Display order"
                inputMode="numeric"
                value={draft.sort_order}
                error={errors.sort_order}
                disabled={saving}
                onChange={(e) => set("sort_order", e.target.value)}
              />
            </div>

            <label className="mt-6 flex cursor-pointer items-start gap-3">
              <input
                type="checkbox"
                checked={draft.is_active}
                disabled={saving}
                onChange={(e) => set("is_active", e.target.checked)}
                className="mt-1 size-4 accent-[var(--color-brass)]"
              />
              <span>
                <span className="block font-mono text-[11px] uppercase tracking-[0.14em] text-chalk">
                  Visible on the website
                </span>
                <span className="mt-1 block text-[13px] text-ash">
                  Turn off to hide this trainer without deleting them.
                </span>
              </span>
            </label>

            <div className="mt-8 flex flex-wrap gap-3">
              <AdminButton variant="primary" busy={saving} disabled={saving} onClick={save}>
                {uploading ? "Uploading photo" : saving ? "Saving" : editing ? "Save changes" : "Add trainer"}
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
        title="Remove this trainer?"
        body={`${deleting?.full_name ?? ""} will be removed from the website immediately. This cannot be undone.`}
        confirmLabel="Remove"
        busy={deleteBusy}
        onConfirm={confirmDelete}
        onCancel={() => setDeleting(null)}
      />

      {toast ? <Toast message={toast.message} tone={toast.tone} onDismiss={dismissToast} /> : null}
    </>
  );
}
