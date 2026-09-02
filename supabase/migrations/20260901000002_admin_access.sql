-- ============================================================================
-- Admin access for the gym dashboard.
--
-- The public policy from the previous migration is left exactly as it was:
-- anon can INSERT a booking and nothing else. Everything below only ADDS
-- narrowly scoped rights for a named set of admin users.
-- ============================================================================

-- ----------------------------------------------------------------------------
-- 1. The dashboard needs a 'completed' status, which the original CHECK
--    constraint did not allow.
-- ----------------------------------------------------------------------------
alter table public.bookings drop constraint if exists bookings_status_valid;

alter table public.bookings add constraint bookings_status_valid
  check (status in ('pending', 'contacted', 'confirmed', 'completed', 'cancelled'));

-- ----------------------------------------------------------------------------
-- 2. Who is an admin.
--
--    Being logged in is NOT the same as being an admin. Authorisation lives in
--    this table, not in the JWT: removing a row revokes access on the very next
--    request, whereas a role baked into a token stays valid until that token
--    expires.
-- ----------------------------------------------------------------------------
create table if not exists public.admins (
  user_id    uuid        primary key references auth.users (id) on delete cascade,
  email      text        not null,
  created_at timestamptz not null default now()
);

comment on table public.admins is
  'Allow-list of gym staff who may read and manage bookings. Managed by hand in the Supabase dashboard — there is no public sign-up.';

alter table public.admins enable row level security;

-- Nobody reaches this table directly. It is only ever consulted through
-- is_admin() below, which runs with elevated rights.
revoke all on public.admins from anon, authenticated;

-- ----------------------------------------------------------------------------
-- 3. The authorisation check itself.
--
--    SECURITY DEFINER is required: admins has RLS on with no readable policy,
--    so a normal query would always come back empty. Running as the owner lets
--    the function see the row while callers still cannot read the table.
--
--    search_path is pinned so nobody can shadow 'admins' with their own table.
-- ----------------------------------------------------------------------------
create or replace function public.is_admin()
returns boolean
language sql
security definer
stable
set search_path = public, pg_temp
as $$
  select exists (
    select 1 from public.admins a where a.user_id = (select auth.uid())
  );
$$;

revoke all on function public.is_admin() from public, anon;
grant execute on function public.is_admin() to authenticated;

-- ----------------------------------------------------------------------------
-- 4. What an admin may do with bookings.
--
--    Table privileges are the outer gate, RLS policies the inner one. A logged
--    in user who is NOT in the admins table passes the grant but fails the
--    policy, so they read exactly zero rows.
--
--    UPDATE is granted on the status column ONLY. Even a real admin cannot
--    rewrite a customer's name, phone number or message — the database refuses
--    it, not just the interface.
-- ----------------------------------------------------------------------------
grant select on public.bookings to authenticated;
grant update (status) on public.bookings to authenticated;

create policy "Admins can read bookings"
  on public.bookings
  for select
  to authenticated
  using (public.is_admin());

create policy "Admins can update booking status"
  on public.bookings
  for update
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- Still deliberately absent: any DELETE policy. Bookings are cancelled by
-- setting status = 'cancelled', never removed. Deletion stays a dashboard-only
-- action performed with the service role.
