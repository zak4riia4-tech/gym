# Deployment checklist — GO FIT GYM

Work top to bottom. Nothing here is optional for a site a real gym depends on.

---

## 1. Before you push to GitHub

- [ ] Confirm secrets are not tracked:
      `git status --porcelain | grep -E "env.local$|ADMIN_CREDENTIALS"` must print **nothing**.
- [ ] `.env.local.example` contains placeholders only — no real keys.
- [ ] `npm run build` succeeds locally.

**If a real key has ever been committed, rotate it.** Deleting the file does not
help; the value stays in the git history. Rotate in
Supabase → Project Settings → API.

---

## 2. Environment variables on Vercel

Add these under **Project → Settings → Environment Variables**, for
Production *and* Preview.

| Variable | Value | Notes |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | `https://dttmbtvidrpkfpirzcke.supabase.co` | Safe in the browser |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | your anon key | Safe in the browser — RLS protects the data |
| `NEXT_PUBLIC_SITE_URL` | `https://your-domain.com` | **Required.** Without it, canonical URLs and social previews point at localhost |

Do **not** add `SUPABASE_SERVICE_ROLE_KEY` or `SUPABASE_DB_PASSWORD`. Nothing in
the application reads them, and the service_role key bypasses Row Level
Security entirely.

---

## 3. Supabase, before going live

- [ ] Change the admin password (Authentication → Users). The seeded one is in
      `ADMIN_CREDENTIALS.local.txt`.
- [x] The admin email is a real address you control, so password reset works.
- [ ] Add each staff member: create the user, then insert a row in
      `public.admins` with their `user_id`. There is no sign-up form by design.
- [ ] Replace the placeholder trainer photos. The current ones are stock images
      of people who do not work at this gym.
- [ ] Replace the placeholder social links in the trainers table.
- [ ] Set the real address, phone and opening hours in `src/content/site.ts`
      (`seo.business`). These are published as structured data — publishing an
      address that is not the gym's is worse than publishing none.

---

## 4. Deploy

```bash
npm i -g vercel
vercel link
vercel --prod
```

Then in Vercel: **Settings → Domains** → add the gym's domain.

---

## 5. After the first deploy

- [ ] Visit `/` — plans and trainers load from the database.
- [ ] Submit a real booking, then confirm the row in the Supabase table editor.
- [ ] Sign in at `/admin/login`.
- [ ] Sign out, then visit `/admin/dashboard` — you must be redirected to login.
- [ ] Edit a plan price and confirm it changes on the public site.
- [ ] Upload a trainer photo and confirm it appears.
- [ ] `https://your-domain.com/robots.txt` and `/sitemap.xml` both load.
- [ ] Paste the URL into WhatsApp — the link preview shows the title and description.
- [ ] Open the site on a real phone.
- [ ] Submit the domain to Google Search Console.

---

## 6. Known gaps — decide before real customers arrive

These are honest limitations of what is built, not bugs.

| Gap | Risk | Fix when |
|---|---|---|
| **No rate limiting on the booking form** | A script could post thousands of fake bookings | Before launch. Cloudflare Turnstile, or a rate check in Postgres |
| **Deleting a trainer leaves their photo in storage** | Wasted storage, slowly grows | Whenever. Needs a database trigger or scheduled cleanup |
| **No Content-Security-Policy header** | Reduces defence against injected scripts | Needs per-request nonces; do it as its own task with testing |
| **No automated tests** | Regressions are caught by hand only | Before the second client site |
| **Homepage renders per request** | Slightly slower than caching | If traffic grows, switch to `revalidate = 60` in `src/app/page.tsx` |

---

## 7. Reselling this to another gym

The design system and every piece of copy live in two places:

- `src/content/site.ts` — brand name, city, currency, section copy, SEO block
- The Supabase tables — plans and trainers, edited from the admin dashboard

For a new client: create a new Supabase project, run the three migrations in
`supabase/migrations/`, edit `site.ts`, and swap the photos. No component
files need touching.
