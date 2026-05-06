-- =====================================================
-- Sauer macht Krustig — Starter Tagebuch
-- Datenbank-Schema für Supabase
-- =====================================================
-- Diese SQL-Datei einfach im Supabase SQL Editor öffnen
-- und in einem Rutsch ausführen.
-- =====================================================

-- 1) Tabelle: starters
-- ---------------------------------------------------
create table if not exists public.starters (
  id           uuid primary key default gen_random_uuid(),
  user_id      uuid not null references auth.users(id) on delete cascade,
  name         text not null,
  flour_type   text,
  hydration    integer default 100,
  default_ratio text default '1:1:1',
  start_date   date,
  notes        text,
  created_at   timestamptz default now(),
  updated_at   timestamptz default now()
);

create index if not exists starters_user_id_idx on public.starters(user_id);

-- 2) Tabelle: feedings
-- ---------------------------------------------------
create table if not exists public.feedings (
  id           uuid primary key default gen_random_uuid(),
  starter_id   uuid not null references public.starters(id) on delete cascade,
  user_id      uuid not null references auth.users(id) on delete cascade,
  asg_g        numeric(7,2) not null,
  flour_g      numeric(7,2) not null,
  water_g      numeric(7,2) not null,
  temperature  numeric(4,1),
  fed_at       timestamptz default now(),
  state        text check (state in ('aktiv','am_peak','ueberreif','schwach','hooch')),
  notes        text,
  created_at   timestamptz default now()
);

create index if not exists feedings_starter_id_idx on public.feedings(starter_id);
create index if not exists feedings_user_id_idx on public.feedings(user_id);
create index if not exists feedings_fed_at_idx on public.feedings(fed_at desc);

-- 3) Row Level Security aktivieren
-- ---------------------------------------------------
alter table public.starters enable row level security;
alter table public.feedings enable row level security;

-- 4) Policies für starters
-- ---------------------------------------------------
drop policy if exists "starters_select_own" on public.starters;
create policy "starters_select_own"
  on public.starters for select
  using (auth.uid() = user_id);

drop policy if exists "starters_insert_own" on public.starters;
create policy "starters_insert_own"
  on public.starters for insert
  with check (auth.uid() = user_id);

drop policy if exists "starters_update_own" on public.starters;
create policy "starters_update_own"
  on public.starters for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

drop policy if exists "starters_delete_own" on public.starters;
create policy "starters_delete_own"
  on public.starters for delete
  using (auth.uid() = user_id);

-- 5) Policies für feedings
-- ---------------------------------------------------
drop policy if exists "feedings_select_own" on public.feedings;
create policy "feedings_select_own"
  on public.feedings for select
  using (auth.uid() = user_id);

drop policy if exists "feedings_insert_own" on public.feedings;
create policy "feedings_insert_own"
  on public.feedings for insert
  with check (auth.uid() = user_id);

drop policy if exists "feedings_update_own" on public.feedings;
create policy "feedings_update_own"
  on public.feedings for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

drop policy if exists "feedings_delete_own" on public.feedings;
create policy "feedings_delete_own"
  on public.feedings for delete
  using (auth.uid() = user_id);

-- 6) updated_at automatisch pflegen
-- ---------------------------------------------------
create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists set_updated_at_starters on public.starters;
create trigger set_updated_at_starters
  before update on public.starters
  for each row execute function public.set_updated_at();
