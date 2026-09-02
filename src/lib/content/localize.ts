import type { Locale } from "@/lib/i18n/config";
import type { MembershipPlanRow, TrainerRow } from "@/lib/supabase/types";

/*
 * Applies a row's per-locale overrides on top of its base columns.
 *
 * Field by field rather than object-spread on purpose: a plan translated only
 * as far as its name should still show its English features underneath, not
 * blank space. Anything the owner has not translated yet simply stays in the
 * language it was entered.
 */

type PlanOverride = Partial<
  Pick<MembershipPlanRow, "name" | "description" | "features" | "inherits">
>;

type TrainerOverride = Partial<
  Pick<TrainerRow, "full_name" | "specialty" | "bio" | "experience" | "certification">
>;

function overrideFor<T>(translations: unknown, locale: Locale): Partial<T> {
  if (locale === "en") return {};
  if (!translations || typeof translations !== "object") return {};
  const value = (translations as Record<string, unknown>)[locale];
  return value && typeof value === "object" ? (value as Partial<T>) : {};
}

/** Non-empty check: a blank translation should fall through, not blank the page. */
function pick<T>(override: T | undefined, base: T): T {
  if (override === undefined || override === null) return base;
  if (typeof override === "string" && override.trim() === "") return base;
  if (Array.isArray(override) && override.length === 0) return base;
  return override;
}

export function localizePlan(plan: MembershipPlanRow, locale: Locale): MembershipPlanRow {
  const t = overrideFor<PlanOverride>(plan.translations, locale);
  return {
    ...plan,
    name: pick(t.name, plan.name),
    description: pick(t.description, plan.description),
    features: pick(t.features, plan.features),
    inherits: t.inherits && t.inherits.trim() !== "" ? t.inherits : plan.inherits,
  };
}

export function localizeTrainer(trainer: TrainerRow, locale: Locale): TrainerRow {
  const t = overrideFor<TrainerOverride>(trainer.translations, locale);
  return {
    ...trainer,
    full_name: pick(t.full_name, trainer.full_name),
    specialty: pick(t.specialty, trainer.specialty),
    bio: pick(t.bio, trainer.bio),
    experience: pick(t.experience, trainer.experience),
    certification:
      t.certification && t.certification.trim() !== "" ? t.certification : trainer.certification,
  };
}
