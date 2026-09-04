# GO FIT GYM — Gym Website & Management System

A production-ready website for a gym, with a public marketing site and a secure
staff dashboard behind it. Built to be resold: all branding and copy live in one
file, and all business content lives in the database.

---

## Overview

The public site presents the gym's programmes, membership plans and coaching
staff, and takes trial booking requests. The staff dashboard lets the gym owner
manage those bookings, plans and trainers without touching any code.

Everything the owner can change — prices, plan features, trainer profiles,
photos — is stored in Supabase and edited from the dashboard. Changes appear on
the public site immediately.

---

## Features

**Public site**
- Programmes, membership plans and trainer profiles, all loaded from the database
- Monthly / yearly pricing toggle with live price switching
- Trial booking form with validation, submitted through a server action
- Fully responsive from 320px upwards
- SEO metadata, Open Graph link previews, `sitemap.xml`, `robots.txt`,
  and `ExerciseGym` structured data

**Staff dashboard** (`/admin`)
- Email and password sign-in, with an explicit admin allow-list
- Booking list with status workflow: pending → contacted → confirmed → completed / cancelled
- Membership plan management: create, edit, delete, reorder, show/hide, mark one as recommended
- Trainer management with image upload to Supabase Storage
- Delete confirmation, success notifications, loading, empty and error states

**Security**
- Row Level Security on every table
- The public can insert a booking and read active content — nothing else
- Admins can only change a booking's `status` column; customer details are
  immutable at the database level
- No service-role key anywhere in the application

---

## Tech stack

| | |
|---|---|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS v4 |
| Icons | Lucide |
| Database, auth, storage | Supabase |
| Hosting | Vercel |

No state library, no component library, no animation library — the design
system is about 80 lines of CSS custom properties in `src/app/globals.css`.

---

## Local setup

Requires Node.js 20 or newer.

```bash
git clone <your-repo-url>
cd gym-web
npm install
cp .env.local.example .env.local   # then fill it in, see below
npm run dev
```

Open http://localhost:3000. The staff dashboard is at `/admin/login`.

### Scripts

| Command | Purpose |
|---|---|
| `npm run dev` | Development server |
| `npm run build` | Production build |
| `npm start` | Serve the production build |
| `npm run typecheck` | TypeScript only, no build |

---

## Environment variables

Copy `.env.local.example` to `.env.local` and fill in the values from your
Supabase project (Dashboard → Project Settings → API).

| Variable | Where it comes from | Safe in the browser? |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase → Project URL | Yes |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase → anon public key | Yes |
| `NEXT_PUBLIC_SITE_URL` | Your live domain | Yes |

Anything prefixed `NEXT_PUBLIC_` is compiled into the JavaScript bundle and is
visible to every visitor. That is fine for the three above: the anon key only
identifies the project, and Row Level Security is what protects the data.

**Never** add the `service_role` key or the database password to this project.
The service-role key bypasses Row Level Security completely.

`.env.local` is git-ignored. Real values must never be committed.

---

## Supabase setup

### 1. Create a project and run the migrations

```bash
npx supabase link --project-ref <your-project-ref>
npx supabase db push
```

The three migrations in `supabase/migrations/` create everything:

| Migration | Creates |
|---|---|
| `..._create_bookings.sql` | `bookings` table, insert-only public policy |
| `..._admin_access.sql` | `admins` allow-list, `is_admin()`, admin policies |
| `..._content_management.sql` | `membership_plans`, `trainers`, `trainer-images` bucket |

### 2. Create the first admin

There is no sign-up form, by design. Create the account manually:

1. Supabase → Authentication → Users → **Add user** (tick *Auto Confirm*).
2. Copy the new user's UUID.
3. Supabase → Table Editor → `admins` → insert a row with that `user_id` and
   the same email.

Being signed in is not the same as being an admin. Only rows in `admins` grant
dashboard access, and removing a row revokes it on the very next request.

### 3. Security model

| Role | Bookings | Plans & trainers | Storage |
|---|---|---|---|
| Public (`anon`) | insert only | read where `is_active` | read only |
| Signed in, not an admin | insert only | read where `is_active` | read only |
| Admin | read + update `status` | full control | upload / replace / delete |

Deletion of bookings is not granted to anyone through the app. Bookings are
cancelled by setting `status = 'cancelled'`.

---

## Deployment

See **[DEPLOYMENT.md](DEPLOYMENT.md)** for the full checklist. In short:

1. Push to GitHub.
2. Import the repository at [vercel.com/new](https://vercel.com/new).
3. Add the three `NEXT_PUBLIC_*` environment variables.
4. Deploy, then work through the post-deploy checklist.

---

## Reselling this to another gym

Two places hold everything client-specific:

- `src/content/site.ts` — brand name, city, currency, section copy, SEO block
- The Supabase tables — plans and trainers, edited from the dashboard

For a new client: create a new Supabase project, run the migrations, edit
`site.ts`, and swap the photos. No component files need changing.

---

## Known limitations

Stated plainly rather than left to be discovered:

- **No rate limiting on the booking form.** Row Level Security prevents reading
  or altering data, and database constraints reject malformed input, but nothing
  stops a script submitting many fake bookings. Add a CAPTCHA before launch.
- **Deleting a trainer leaves their photo in storage.** Harmless, but it
  accumulates. Needs a database trigger or a scheduled cleanup.
- **No Content-Security-Policy header.** Needs per-request nonces to work with
  Next.js; worth doing as its own task.
- **No automated tests.** Everything has been verified by hand.
- The trainer photos and social links currently in the database are placeholders.
