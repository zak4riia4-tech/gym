-- ============================================================================
-- Translations for the content the owner edits.
--
-- Plan names, descriptions, features and trainer bios live in these tables, so
-- the site UI being translated is not enough — in Kurdish or Arabic those
-- fields would still come back in whatever language they were typed.
--
-- Stored as jsonb keyed by locale rather than as name_ckb / name_ar columns:
-- adding a fourth language then costs nothing, and a row with no translation
-- simply falls back to the base columns instead of showing an empty string.
--
--   { "ckb": { "name": "...", "description": "..." },
--     "ar":  { "name": "...", "description": "..." } }
-- ============================================================================

alter table public.membership_plans
  add column if not exists translations jsonb not null default '{}'::jsonb;

alter table public.trainers
  add column if not exists translations jsonb not null default '{}'::jsonb;

-- Keep the blob small and shaped like an object, not an array or a scalar.
alter table public.membership_plans drop constraint if exists membership_plans_translations_shape;
alter table public.membership_plans add constraint membership_plans_translations_shape
  check (jsonb_typeof(translations) = 'object' and pg_column_size(translations) < 8192);

alter table public.trainers drop constraint if exists trainers_translations_shape;
alter table public.trainers add constraint trainers_translations_shape
  check (jsonb_typeof(translations) = 'object' and pg_column_size(translations) < 8192);

comment on column public.membership_plans.translations is
  'Per-locale overrides keyed by locale code. Missing keys fall back to the base columns.';

comment on column public.trainers.translations is
  'Per-locale overrides keyed by locale code. Missing keys fall back to the base columns.';

-- Admins already hold UPDATE on every column of these tables through the
-- "Admins manage plans" / "Admins manage trainers" policies, and anon still
-- only holds SELECT on active rows. Nothing about the security model changes:
-- a translation is just another field on a row the same people could already
-- edit and the same visitors could already read.
