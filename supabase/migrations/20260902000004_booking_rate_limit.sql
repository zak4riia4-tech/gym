-- ============================================================================
-- Rate limiting for the public booking form.
--
-- Until now nothing stopped a script posting thousands of bookings. Row Level
-- Security protects the DATA; it says nothing about volume.
--
-- This is enforced by a trigger rather than in the application, on purpose:
-- the form, the server action and anyone calling the REST endpoint directly
-- all go through the same check. There is no path around it.
--
-- It is not a replacement for a CAPTCHA — someone can still vary the email and
-- phone on every request. It stops the naive flood, which is the realistic
-- threat for a gym website, and it costs nothing.
-- ============================================================================

create or replace function public.enforce_booking_rate_limit()
returns trigger
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  per_email  integer;
  per_phone  integer;
  per_minute integer;
begin
  -- Same person, same day. Three is generous for a real enquiry.
  select count(*) into per_email
  from public.bookings
  where lower(email) = lower(new.email)
    and created_at > now() - interval '24 hours';

  if per_email >= 3 then
    raise exception 'booking_rate_limit_email'
      using hint = 'This email address has already sent several requests today.';
  end if;

  select count(*) into per_phone
  from public.bookings
  where phone_number = new.phone_number
    and created_at > now() - interval '24 hours';

  if per_phone >= 3 then
    raise exception 'booking_rate_limit_phone'
      using hint = 'This phone number has already sent several requests today.';
  end if;

  -- Crude flood ceiling across the whole table. A real gym will never see ten
  -- genuine requests inside one minute; a script will.
  select count(*) into per_minute
  from public.bookings
  where created_at > now() - interval '1 minute';

  if per_minute >= 10 then
    raise exception 'booking_rate_limit_global'
      using hint = 'Too many requests are arriving at once. Try again shortly.';
  end if;

  return new;
end;
$$;

revoke all on function public.enforce_booking_rate_limit() from public, anon, authenticated;

drop trigger if exists bookings_rate_limit on public.bookings;

create trigger bookings_rate_limit
  before insert on public.bookings
  for each row
  execute function public.enforce_booking_rate_limit();

comment on function public.enforce_booking_rate_limit() is
  'Caps public booking submissions: 3 per email and 3 per phone per day, and 10 across the table per minute. Runs as a BEFORE INSERT trigger so no client can route around it.';

-- The counting queries above need an index or they will scan the table as it
-- grows. created_at already has one; these cover the email and phone lookups.
create index if not exists bookings_email_created_idx
  on public.bookings (lower(email), created_at desc);

create index if not exists bookings_phone_created_idx
  on public.bookings (phone_number, created_at desc);
