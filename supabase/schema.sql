-- SHR Cars — database schema. Run once in Supabase → SQL Editor.

create table if not exists public.cars (
  slug          text primary key,
  name          text not null,
  category      text not null check (category in ('4x4','citadine','midrange')),
  image         text not null,
  price_per_day numeric(10,2) not null,
  deposit       numeric(10,2) not null default 0,
  transmission  text not null check (transmission in ('manual','automatic')),
  fuel          text not null check (fuel in ('diesel','petrol')),
  seats         int  not null default 5,
  ac            boolean not null default true,
  units         int  not null default 1 check (units >= 1),  -- identical cars you own
  active        boolean not null default true,
  created_at    timestamptz not null default now()
);

create table if not exists public.customers (
  id         bigint generated always as identity primary key,
  name       text not null,
  email      text unique,
  phone      text,
  country    text,
  created_at timestamptz not null default now()
);

create table if not exists public.bookings (
  id             bigint generated always as identity (start with 1100) primary key,  -- order number
  code           text not null unique,                                              -- public confirmation code
  car_slug       text not null references public.cars(slug),
  customer_id    bigint references public.customers(id),
  status         text not null default 'confirmed' check (status in ('pending','confirmed','cancelled','completed')),
  pickup_at      timestamptz not null,
  return_at      timestamptz not null,
  pickup_place   text not null,
  return_place   text not null,
  days           int not null,
  price_per_day  numeric(10,2) not null,
  total          numeric(10,2) not null,
  deposit        numeric(10,2) not null default 0,
  notes          text,
  locale         text not null default 'en',
  source         text not null default 'website',   -- website | admin
  created_at     timestamptz not null default now(),
  check (return_at > pickup_at)
);
create index if not exists bookings_car_period_idx on public.bookings (car_slug, pickup_at, return_at);
create index if not exists bookings_status_idx on public.bookings (status);

create table if not exists public.posts (
  id         bigint generated always as identity primary key,
  slug       text not null,
  locale     text not null default 'en',
  title      text not null,
  excerpt    text not null default '',
  content    text not null default '',
  cover      text,
  published  boolean not null default false,
  created_at timestamptz not null default now(),
  unique (slug, locale)
);

-- Security: the website only talks to the database from the server with the service-role key,
-- so we lock the tables for the public (anon) key completely.
alter table public.cars      enable row level security;
alter table public.customers enable row level security;
alter table public.bookings  enable row level security;
alter table public.posts     enable row level security;
