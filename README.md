# SHR Cars Rental — Next.js site

Next.js 15 (App Router) · TypeScript · Tailwind · next-intl (English at `/`, plus `/fr /es /de /nl /it`) · Supabase · Hostinger SMTP.

## What is inside
- Public site in 6 languages with localized URLs (`/fr/nos-voitures`, `/es/nuestros-coches`, …), hreflang, canonical, sitemap.xml, robots.txt, JSON-LD (AutoRental, Product, FAQPage, BlogPosting).
- Search with availability and price, car pages, 11 city landing pages, booking (**pay at the agency**), confirmation page, contact form, blog.
- Admin (`/admin`): dashboard, bookings (confirm / complete / cancel, manual phone bookings), clients, cars and prices, blog editor.
- Emails: admin and customer (in the customer's language) on every booking.

## Setup (about 30 minutes)
1. `npm install`
2. Create a Supabase project, open SQL Editor, run `supabase/schema.sql`, then `supabase/seed.sql`.
3. Supabase → Authentication → Users → Add user (your email + a password). Put that email in `ADMIN_EMAILS`.
4. Copy `.env.example` to `.env.local` and fill it in (Supabase URL and keys, SMTP credentials, site URL).
5. In Hostinger, create a mailbox for your domain and use its address as `SMTP_USER` and `EMAIL_FROM`, with its password as `SMTP_PASS`. The default SMTP settings are `smtp.hostinger.com`, port `465`, and SSL enabled; port `587` with `SMTP_SECURE=false` is also supported.
6. `npm run dev` → http://localhost:3000 · admin: http://localhost:3000/admin
7. Deploy on Vercel, add the same env vars, attach your domain.

## Edit before launch
- Admin → Cars & prices: the Hilux and Tank 300 deposits are placeholders; check every price and the `units` count.
- `src/lib/places.ts`: city images and pickup points.
- `messages/*.json`: all texts (a native-speaker review is recommended for DE, NL and IT).
- Images are still loaded from the old WordPress site (`next.config.ts` → remotePatterns). Download them into `public/images` before the old site is removed.
- `src/lib/reviews.ts`: the Google reviews shown on the home page.
