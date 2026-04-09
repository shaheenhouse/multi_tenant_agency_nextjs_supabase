# Agency Booking Portal

Multi-tenant booking app built with `Next.js + Supabase + Prisma`, with strict tenant isolation at database level using Supabase RLS.

## What This Project Does

- Agency signup/login using Supabase Auth (email + password)
- Each agency sees only its own bookings
- Booking list with status colors:
  - `Confirmed` -> green
  - `Pending` -> orange
  - `Cancelled` -> red
- Add booking form with instant appearance in list
- Manual seed script for 2 agencies (5 bookings each, total 10)

## Architecture (Simple View)

- **Auth:** Supabase Auth manages sessions and user identity.
- **Tenant ID:** authenticated user ID (`auth.uid()`) is the agency tenant key.
- **Isolation:** Supabase RLS policies enforce row access in DB (`agency_id = auth.uid()`).
- **DB Schema:** managed code-first with Prisma migrations.
- **UI/Data flow:** Next.js App Router + Supabase client/server helpers.

## Prisma (Modular Schema)

Prisma schema is split for large-project maintainability:

- `prisma/schema/base.prisma` -> generator, datasource, shared enums
- `prisma/schema/agency.prisma` -> `Agency` model
- `prisma/schema/booking.prisma` -> `Booking` model

Migrations live in `prisma/migrations`.

## Environment Variables

Copy `.env.example` to `.env.local` (or use `.env`):

```bash
cp .env.example .env.local
```

Required values:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `DATABASE_URL` (Supabase pooler URL, typically port `6543`)
- `DIRECT_URL` (Supabase direct URL for migrations, typically port `5432`)
- `SEED_AGENCY_1_EMAIL`
- `SEED_AGENCY_2_EMAIL`

## Setup Steps

1. Install deps:
   ```bash
   npm install
   ```
2. Apply DB schema:
   ```bash
   npm run prisma:migrate:deploy
   ```
3. Start app:
   ```bash
   npm run dev
   ```
4. Sign up both agencies in app (once).
5. Seed bookings:
   ```bash
   npm run db:seed
   ```

## Seed Data Prefix (Important)

Seeded records include a prefix based on agency email local-part so data is visually identifiable per agency.

Examples:

- Agency email: `agency1@example.com`
  - `booking_ref`: `AGENCY1-BK-1A2B3C4D`
  - `client_name`: `AGENCY1 Olivia Chen`
- Agency email: `agency2@example.com`
  - `booking_ref`: `AGENCY2-BK-9F8E7D6C`
  - `client_name`: `AGENCY2 Liam Wilson`

This helps quickly prove tenant-separated data during demos/review.

## Useful Commands

- `npm run prisma:generate` -> regenerate Prisma client
- `npm run prisma:migrate:dev` -> create migration during development
- `npm run prisma:migrate:deploy` -> apply committed migrations
- `npm run db:seed` -> seed two agencies with prefixed records
- `npm run lint` -> run lint
- `npm run build` -> production build check

## Multi-Tenancy Verification Checklist

1. Login as Agency 1 -> only Agency 1 bookings visible.
2. Login as Agency 2 -> only Agency 2 bookings visible.
3. Add booking as Agency 2 -> appears immediately for Agency 2.
4. Login back as Agency 1 -> Agency 2 new booking is not visible.

## Deployment

1. Push repo to GitHub.
2. Import into Vercel.
3. Add same env vars in Vercel project settings.
4. Deploy.
