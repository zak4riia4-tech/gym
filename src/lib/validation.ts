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
): BookingFormErrors {
  const errors: BookingFormErrors = {};

  const fullName = values.fullName.trim();
  if (!fullName) errors.fullName = "Enter your full name.";
  else if (fullName.length < 2) errors.fullName = "That name looks too short.";
  else if (fullName.length > 100) errors.fullName = "Keep the name under 100 characters.";

  const email = values.email.trim();
  if (!email) errors.email = "Enter your email address.";
  else if (!EMAIL_PATTERN.test(email)) errors.email = "That email address is not valid.";
  else if (email.length > 254) errors.email = "That email address is too long.";

  const phone = values.phoneNumber.trim();
  if (!phone) errors.phoneNumber = "Enter a phone number we can reach you on.";
  else if (!PHONE_PATTERN.test(phone)) errors.phoneNumber = "Enter a valid phone number, e.g. 0750 123 4567.";

  if (!values.membershipPlan) errors.membershipPlan = "Choose a membership plan.";
  else if (!validPlanSlugs.includes(values.membershipPlan)) {
    errors.membershipPlan = "Choose a valid membership plan.";
  }

  if (!values.preferredStartDate) {
    errors.preferredStartDate = "Choose when you would like to start.";
  } else if (values.preferredStartDate < todayIso()) {
    errors.preferredStartDate = "Pick today or a later date.";
  }

  if (values.fitnessGoal.length > 120) errors.fitnessGoal = "That goal is too long.";
  if (values.message.length > 2000) errors.message = "Keep the message under 2000 characters.";

  return errors;
}
