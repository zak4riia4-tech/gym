import type { PlanId } from "@/content/site";

export type MembershipPlanRow = {
  id: string;
  created_at: string;
  slug: string;
  name: string;
  description: string;
  monthly_price: number;
  yearly_price: number;
  features: string[];
  inherits: string | null;
  is_recommended: boolean;
  is_active: boolean;
  sort_order: number;
  /** Per-locale overrides, keyed by locale code. Missing keys fall back. */
  translations: Record<string, Record<string, unknown>>;
};

export type MembershipPlanInsert = Omit<MembershipPlanRow, "id" | "created_at">;

export type TrainerRow = {
  id: string;
  created_at: string;
  full_name: string;
  specialty: string;
  bio: string;
  experience: string;
  certification: string | null;
  image_url: string | null;
  instagram_url: string | null;
  facebook_url: string | null;
  is_active: boolean;
  sort_order: number;
  /** Per-locale overrides, keyed by locale code. Missing keys fall back. */
  translations: Record<string, Record<string, unknown>>;
};

export type TrainerInsert = Omit<TrainerRow, "id" | "created_at">;

/** Lifecycle of a booking. Only 'pending' can ever be written by the public. */
export type BookingStatus =
  | "pending"
  | "contacted"
  | "confirmed"
  | "completed"
  | "cancelled";

/** Exactly the columns the website is allowed to write. */
export type BookingInsert = {
  full_name: string;
  email: string;
  phone_number: string;
  membership_plan: PlanId;
  /** ISO date, "YYYY-MM-DD". */
  preferred_start_date: string;
  fitness_goal: string | null;
  message: string | null;
};

/** A full row, as the gym sees it in the dashboard. */
export type BookingRow = BookingInsert & {
  id: string;
  created_at: string;
  status: BookingStatus;
};

/**
 * Shape of the database for the Supabase client's generics. Typing the client
 * means a typo in a column name is a build error, not a runtime surprise.
 */
export type Database = {
  public: {
    Tables: {
      admins: {
        Row: { user_id: string; email: string; created_at: string };
        Insert: { user_id: string; email: string };
        Update: { email?: string };
        Relationships: [];
      };
      membership_plans: {
        Row: MembershipPlanRow;
        Insert: MembershipPlanInsert;
        Update: Partial<MembershipPlanInsert>;
        Relationships: [];
      };
      trainers: {
        Row: TrainerRow;
        Insert: TrainerInsert;
        Update: Partial<TrainerInsert>;
        Relationships: [];
      };
      bookings: {
        Row: BookingRow;
        Insert: BookingInsert;
        /* Status only — it mirrors the column-level UPDATE grant in the
           migration, so the type system refuses what the database would
           refuse anyway. */
        Update: { status?: BookingStatus };
        Relationships: [];
      };
    };
    // The Supabase client checks for all five of these keys. Leaving any of
    // them out makes it fall back to untyped queries, and insert() then stops
    // accepting a single object.
    Views: Record<never, never>;
    Functions: {
      is_admin: { Args: Record<never, never>; Returns: boolean };
    };
    Enums: Record<never, never>;
    CompositeTypes: Record<never, never>;
  };
};
