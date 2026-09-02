-- ============================================================================
-- bookings — membership booking requests submitted from the public website.
--
-- This table is written to directly from the browser using the public anon
-- key, which anyone can read out of the JavaScript bundle. That means the
-- database itself is the security boundary, not the form. Everything below
-- assumes the caller is hostile.
-- ============================================================================

create table if not exists public.bookings (
  id                   uuid        primary key default gen_random_uuid(),
  created_at           timestamptz not null default now(),

  full_name            text        not null,
  email                text        not null,
  phone_number         text        not null,
  membership_plan      text        not null,
  preferred_start_date date        not null,
  fitness_goal         text,
  message              text,

  status               text        not null default 'pending',

  -- Length caps. Without these, anyone could post megabytes into the table.
  constraint bookings_full_name_len
    check (char_length(full_name) between 2 and 100),
  constraint bookings_email_len
    check (char_length(email) between 5 and 254),
  constraint bookings_phone_len
    check (char_length(phone_number) between 6 and 32),
  constraint bookings_fitness_goal_len
    check (fitness_goal is null or char_length(fitness_goal) <= 120),
  constraint bookings_message_len
    check (message is null or char_length(message) <= 2000),

  -- Shape checks.
  constraint bookings_email_format
    check (email ~* '^[^@[:space:]]+@[^@[:space:]]+\.[^@[:space:]]+$'),
  constraint bookings_plan_valid
    check (membership_plan in ('basic', 'pro', 'elite')),
  constraint bookings_status_valid
    check (status in ('pending', 'contacted', 'confirmed', 'cancelled'))
);

-- The gym reads this table newest-first from the dashboard.
create index if not exists bookings_created_at_idx
  on public.bookings (created_at desc);

comment on table public.bookings is
  'Public booking requests. Insert-only for anon; read/update/delete via the Supabase dashboard or a service-role key.';

-- ============================================================================
-- ROW LEVEL SECURITY
--
-- With RLS enabled and no policy for an action, that action is DENIED.
-- So the single INSERT policy below is the ONLY thing the public can do.
-- ============================================================================

alter table public.bookings enable row level security;

-- Defence in depth: strip every table privilege from the public roles, then
-- grant back only INSERT. If RLS were ever switched off by accident, these
-- roles still physically cannot read, update or delete a single row.
revoke all on public.bookings from anon, authenticated;
grant insert on public.bookings to anon, authenticated;

-- The one thing the website is allowed to do.
-- with check() runs AFTER column defaults are applied, so a form that omits
-- status passes (default 'pending'), while a crafted request trying to insert
-- status = 'confirmed' is rejected.
create policy "Public can submit a booking"
  on public.bookings
  for insert
  to anon, authenticated
  with check (status = 'pending');

-- Deliberately NOT created: select, update or delete policies.
-- Reading and managing bookings happens in the Supabase dashboard, or later
-- through an authenticated staff role added in a separate migration.
