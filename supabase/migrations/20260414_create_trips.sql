create extension if not exists "pgcrypto";

create table if not exists public.trips (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  name text not null,
  context jsonb not null,
  tasks jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create index if not exists trips_user_id_updated_at_idx
  on public.trips (user_id, updated_at desc);

create or replace function public.set_trips_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$$;

drop trigger if exists set_trips_updated_at on public.trips;

create trigger set_trips_updated_at
before update on public.trips
for each row
execute function public.set_trips_updated_at();

alter table public.trips enable row level security;

drop policy if exists "Users can read own trips" on public.trips;
create policy "Users can read own trips"
on public.trips
for select
to authenticated
using (auth.uid() = user_id);

drop policy if exists "Users can insert own trips" on public.trips;
create policy "Users can insert own trips"
on public.trips
for insert
to authenticated
with check (auth.uid() = user_id);

drop policy if exists "Users can update own trips" on public.trips;
create policy "Users can update own trips"
on public.trips
for update
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

drop policy if exists "Users can delete own trips" on public.trips;
create policy "Users can delete own trips"
on public.trips
for delete
to authenticated
using (auth.uid() = user_id);
