-- Prisma migration for Supabase multi-tenant booking app.
create extension if not exists pgcrypto;

do $$
begin
  if not exists (select 1 from pg_type where typname = 'BookingStatus') then
    create type "BookingStatus" as enum ('Confirmed', 'Pending', 'Cancelled');
  end if;
end
$$;

create table if not exists public.agencies (
  id uuid not null,
  email text not null,
  name text not null,
  created_at timestamptz not null default timezone('utc', now()),
  constraint agencies_pkey primary key (id),
  constraint agencies_email_key unique (email),
  constraint agencies_id_fkey foreign key (id) references auth.users (id) on delete cascade
);

create table if not exists public.bookings (
  id uuid not null default gen_random_uuid(),
  agency_id uuid not null,
  booking_ref text not null,
  client_name text not null check (char_length(client_name) >= 2),
  destination text not null check (char_length(destination) >= 2),
  travel_date date not null,
  amount_aud numeric(12, 2) not null check (amount_aud >= 0),
  status "BookingStatus" not null,
  created_at timestamptz not null default timezone('utc', now()),
  constraint bookings_pkey primary key (id),
  constraint bookings_booking_ref_key unique (booking_ref),
  constraint bookings_agency_id_fkey foreign key (agency_id) references public.agencies (id) on delete cascade
);

create index if not exists idx_bookings_agency_id_travel_date
  on public.bookings (agency_id, travel_date desc);

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.agencies (id, email, name)
  values (
    new.id,
    new.email,
    initcap(split_part(new.email, '@', 1))
  )
  on conflict (id) do nothing;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute procedure public.handle_new_user();

alter table public.agencies enable row level security;
alter table public.bookings enable row level security;

drop policy if exists "agency_can_read_own_profile" on public.agencies;
create policy "agency_can_read_own_profile"
on public.agencies
for select
to authenticated
using (auth.uid() = id);

drop policy if exists "agency_can_update_own_profile" on public.agencies;
create policy "agency_can_update_own_profile"
on public.agencies
for update
to authenticated
using (auth.uid() = id)
with check (auth.uid() = id);

drop policy if exists "agency_can_read_own_bookings" on public.bookings;
create policy "agency_can_read_own_bookings"
on public.bookings
for select
to authenticated
using (auth.uid() = agency_id);

drop policy if exists "agency_can_insert_own_bookings" on public.bookings;
create policy "agency_can_insert_own_bookings"
on public.bookings
for insert
to authenticated
with check (auth.uid() = agency_id);

drop policy if exists "agency_can_update_own_bookings" on public.bookings;
create policy "agency_can_update_own_bookings"
on public.bookings
for update
to authenticated
using (auth.uid() = agency_id)
with check (auth.uid() = agency_id);

drop policy if exists "agency_can_delete_own_bookings" on public.bookings;
create policy "agency_can_delete_own_bookings"
on public.bookings
for delete
to authenticated
using (auth.uid() = agency_id);

create or replace function public.set_agency_id_on_booking_insert()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if new.agency_id is null then
    new.agency_id = auth.uid();
  end if;
  return new;
end;
$$;

drop trigger if exists set_booking_agency_id on public.bookings;
create trigger set_booking_agency_id
before insert on public.bookings
for each row execute procedure public.set_agency_id_on_booking_insert();
