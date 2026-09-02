import type { Dictionary } from "@/content/i18n/en";
import type { PlanId } from "@/content/site";

export type BookingFormValues = {
  fullName: string;
  email: string;
  phoneNumber: string;
  membershipPlan: PlanId | "";
  preferredStartDate: string;
  fitnessGoal: string;
  message: string;
};

export type BookingFormErrors = Partial<Record<keyof BookingFormValues, string>>;

export const EMPTY_BOOKING_FORM: BookingFormValues = {
  fullName: "",
  email: "",
  phoneNumber: "",
  membershipPlan: "",
  preferredStartDate: "",
  fitnessGoal: "",
  message: "",
};

/* Mirrors of the CHECK constraints in the database migration. Keeping the two
   in step is what stops a form that looks valid from being rejected server-side. */
const EMAIL_PATTERN = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
const PHONE_PATTERN = /^[+\d][\d\s\-()]{5,31}$/;

/** Today as "YYYY-MM-DD" in the visitor's own timezone. */
export function todayIso(): string {
  const now = new Date();
  const local = new Date(now.getTime() - now.getTimezoneOffset() * 60_000);
  return local.toISOString().slice(0, 10);
}

/**
 * Validates the whole form and returns one message per invalid field.
 * An empty object means the form is good to send.
 */
export function validateBooking(
  values: BookingFormValues,
  /** Slugs currently on sale. Passed in because plans are editable now. */
  validPlanSlugs: readonly string[],
  /** Messages in the visitor's language. Passed in so this stays pure and
      usable from both the browser and the server action. */
  m: Dictionary["booking"]["errors"],
): BookingFormErrors {
  const errors: BookingFormErrors = {};

  const fullName = values.fullName.trim();
  if (!fullName) errors.fullName = m.nameRequired;
  else if (fullName.length < 2) errors.fullName = m.nameShort;
  else if (fullName.length > 100) errors.fullName = m.nameLong;

  const email = values.email.trim();
  if (!email) errors.email = m.emailRequired;
  else if (!EMAIL_PATTERN.test(email)) errors.email = m.emailInvalid;
  else if (email.length > 254) errors.email = m.emailLong;

  const phone = values.phoneNumber.trim();
  if (!phone) errors.phoneNumber = m.phoneRequired;
  else if (!PHONE_PATTERN.test(phone)) errors.phoneNumber = m.phoneInvalid;

  if (!values.membershipPlan) errors.membershipPlan = m.planRequired;
  else if (!validPlanSlugs.includes(values.membershipPlan)) {
    errors.membershipPlan = m.planInvalid;
  }

  if (!values.preferredStartDate) {
    errors.preferredStartDate = m.dateRequired;
  } else if (values.preferredStartDate < todayIso()) {
    errors.preferredStartDate = m.datePast;
  }

  if (values.fitnessGoal.length > 120) errors.fitnessGoal = m.goalLong;
  if (values.message.length > 2000) errors.message = m.messageLong;

  return errors;
}
