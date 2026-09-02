-- ============================================================================
-- Content management: membership plans and trainers become editable data
-- instead of hardcoded arrays in the source.
--
-- Security model, in one line: the public may READ rows marked active and
-- nothing else; admins may do anything. Same is_admin() gate as bookings.
-- ============================================================================

-- ----------------------------------------------------------------------------
-- 0. bookings.membership_plan can no longer be a fixed list.
--
--    The old CHECK allowed only basic/pro/elite. As soon as the owner creates a
--    fourth plan, every booking for it would be rejected. A length check keeps
--    the column sane without freezing the product catalogue.
--
--    Deliberately NOT a foreign key: a booking must survive the deletion of the
--    plan it was made against, or the gym loses its own history.
-- ----------------------------------------------------------------------------
alter table public.bookings drop constraint if exists bookings_plan_valid;

alter table public.bookings add constraint bookings_plan_len
  check (char_length(membership_plan) between 1 and 60);

-- ----------------------------------------------------------------------------
-- 1. Membership plans
-- ----------------------------------------------------------------------------
create table if not exists public.membership_plans (
  id             uuid        primary key default gen_random_uuid(),
  created_at     timestamptz not null default now(),

  -- Stable, human readable key. This is what bookings.membership_plan stores,
  -- so it must not change once bookings exist against it.
  slug           text        not null unique,

  name           text        not null,
  description    text        not null default '',

  -- Whole Iraqi dinar, per month. Integer because money must never be a float.
  monthly_price  integer     not null default 0,
  yearly_price   integer     not null default 0,

  features       text[]      not null default '{}',

  -- Optional "Everything in X" line above the feature list.
  inherits       text,

  is_recommended boolean     not null default false,
  is_active      boolean     not null default true,
  sort_order     integer     not null default 0,

  constraint membership_plans_slug_format
    check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$' and char_length(slug) between 2 and 60),
  constraint membership_plans_name_len
    check (char_length(name) between 2 and 60),
  constraint membership_plans_description_len
    check (char_length(description) <= 400),
  constraint membership_plans_prices_positive
    check (monthly_price >= 0 and yearly_price >= 0),
  constraint membership_plans_features_count
    check (array_length(features, 1) is null or array_length(features, 1) <= 20)
);

comment on table public.membership_plans is
  'Membership tiers shown on the public site. Edited from /admin/memberships.';

create index if not exists membership_plans_active_idx
  on public.membership_plans (is_active, sort_order);

-- ----------------------------------------------------------------------------
-- 2. Trainers
-- ----------------------------------------------------------------------------
create table if not exists public.trainers (
  id            uuid        primary key default gen_random_uuid(),
  created_at    timestamptz not null default now(),

  full_name     text        not null,
  specialty     text        not null,
  bio           text        not null default '',
  experience    text        not null default '',
  certification text,

  -- Public URL of a file in the 'trainer-images' storage bucket. The image
  -- itself is NEVER stored in this table — only the address of it.
  image_url     text,

  instagram_url text,
  facebook_url  text,

  is_active     boolean     not null default true,
  sort_order    integer     not null default 0,

  constraint trainers_full_name_len   check (char_length(full_name) between 2 and 80),
  constraint trainers_specialty_len   check (char_length(specialty) between 2 and 60),
  constraint trainers_bio_len         check (char_length(bio) <= 600),
  constraint trainers_experience_len  check (char_length(experience) <= 40),
  -- Only real web addresses. Blocks javascript: and data: URLs being stored
  -- and later rendered into an href.
  constraint trainers_image_url_shape
    check (image_url is null or image_url ~* '^https?://'),
  constraint trainers_instagram_shape
    check (instagram_url is null or instagram_url ~* '^https?://'),
  constraint trainers_facebook_shape
    check (facebook_url is null or facebook_url ~* '^https?://')
);

comment on table public.trainers is
  'Coaching staff shown on the public site. Edited from /admin/trainers.';

create index if not exists trainers_active_idx
  on public.trainers (is_active, sort_order);

-- ============================================================================
-- ROW LEVEL SECURITY
--
-- Both tables follow the same shape:
--   anon           -> SELECT, and only rows where is_active is true
--   authenticated  -> everything, but only if is_admin() says so
-- ============================================================================

alter table public.membership_plans enable row level security;
alter table public.trainers        enable row level security;

-- Start from zero on both tables, then hand back exactly what is needed.
revoke all on public.membership_plans from anon, authenticated;
revoke all on public.trainers        from anon, authenticated;

grant select                         on public.membership_plans to anon;
grant select, insert, update, delete on public.membership_plans to authenticated;

grant select                         on public.trainers to anon;
grant select, insert, update, delete on public.trainers to authenticated;

-- Visitors see the published rows only. A deactivated plan or a trainer who
-- has left is invisible to the public but still fully visible to the owner.
create policy "Public can read active plans"
  on public.membership_plans for select to anon
  using (is_active = true);

create policy "Public can read active trainers"
  on public.trainers for select to anon
  using (is_active = true);

-- Admins get the full picture and full control. A logged-in non-admin passes
-- the table grant but fails every policy, so they see nothing and change
-- nothing — exactly as with bookings.
create policy "Admins manage plans"
  on public.membership_plans for all to authenticated
  using (public.is_admin())
  with check (public.is_admin());

create policy "Admins manage trainers"
  on public.trainers for all to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- ============================================================================
-- STORAGE — trainer photographs
--
-- A public bucket: anyone can fetch an image by its URL, which is what makes
-- it usable on the website. Only admins can put files in, replace them, or
-- remove them.
-- ============================================================================

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'trainer-images',
  'trainer-images',
  true,
  5242880,  -- 5 MB ceiling, enforced by the server not the browser
  array['image/jpeg', 'image/png', 'image/webp', 'image/avif']
)
on conflict (id) do update
  set public = excluded.public,
      file_size_limit = excluded.file_size_limit,
      allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "Public can view trainer images"  on storage.objects;
drop policy if exists "Admins upload trainer images"    on storage.objects;
drop policy if exists "Admins replace trainer images"   on storage.objects;
drop policy if exists "Admins delete trainer images"    on storage.objects;

create policy "Public can view trainer images"
  on storage.objects for select to anon, authenticated
  using (bucket_id = 'trainer-images');

create policy "Admins upload trainer images"
  on storage.objects for insert to authenticated
  with check (bucket_id = 'trainer-images' and public.is_admin());

create policy "Admins replace trainer images"
  on storage.objects for update to authenticated
  using (bucket_id = 'trainer-images' and public.is_admin())
  with check (bucket_id = 'trainer-images' and public.is_admin());

create policy "Admins delete trainer images"
  on storage.objects for delete to authenticated
  using (bucket_id = 'trainer-images' and public.is_admin());
