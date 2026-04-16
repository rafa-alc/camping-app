alter table public.trips
add column if not exists reward_meta jsonb not null default
  '{"eligible": false, "claimed": false, "claimedAt": null, "origin": "legacy"}'::jsonb;

create table if not exists public.user_progress (
  user_id uuid primary key references auth.users (id) on delete cascade,
  total_points integer not null default 0 check (total_points >= 0 and total_points <= 10000),
  rewarded_trip_context_ids jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create or replace function public.set_user_progress_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$$;

drop trigger if exists set_user_progress_updated_at on public.user_progress;

create trigger set_user_progress_updated_at
before update on public.user_progress
for each row
execute function public.set_user_progress_updated_at();

create index if not exists user_progress_updated_at_idx
  on public.user_progress (updated_at desc);

alter table public.user_progress enable row level security;

drop policy if exists "Users can read own progress" on public.user_progress;
create policy "Users can read own progress"
on public.user_progress
for select
to authenticated
using (auth.uid() = user_id);

drop policy if exists "Users can insert own progress" on public.user_progress;
create policy "Users can insert own progress"
on public.user_progress
for insert
to authenticated
with check (auth.uid() = user_id);

drop policy if exists "Users can update own progress" on public.user_progress;
create policy "Users can update own progress"
on public.user_progress
for update
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);
