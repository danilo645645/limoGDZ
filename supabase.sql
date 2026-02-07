-- Supabase schema для общей ленты (работает с GitHub Pages)
-- Выполни в Supabase: SQL Editor → New query → Run.

-- нужно для gen_random_uuid()
create extension if not exists pgcrypto;

-- Профили
create table if not exists public.profiles (
  username text primary key,
  nick text default '',
  about text default '',
  avatar_url text default '',
  updated_at timestamptz default now()
);

-- Посты
create table if not exists public.posts (
  id uuid primary key default gen_random_uuid(),
  username text not null,
  text text default '',
  media_url text default '',
  media_type text default '',
  created_at timestamptz not null default now(),
  likes jsonb not null default '[]'::jsonb,
  comments jsonb not null default '[]'::jsonb
);

-- Индексы
create index if not exists posts_created_at_idx on public.posts (created_at desc);
create index if not exists posts_username_idx on public.posts (username);

-- RLS (важно)
alter table public.posts enable row level security;
alter table public.profiles enable row level security;

-- ПОЛИТИКИ (анонимный доступ, т.к. у нас нет серверной авторизации)
-- ВНИМАНИЕ: любой сможет публиковать/лайкать от любого username. Это ограничение "только фронтенд".
drop policy if exists "public read posts" on public.posts;
create policy "public read posts" on public.posts
  for select to anon, authenticated
  using (true);

drop policy if exists "public write posts" on public.posts;
create policy "public write posts" on public.posts
  for insert to anon, authenticated
  with check (true);

drop policy if exists "public update posts" on public.posts;
create policy "public update posts" on public.posts
  for update to anon, authenticated
  using (true)
  with check (true);

drop policy if exists "public read profiles" on public.profiles;
create policy "public read profiles" on public.profiles
  for select to anon, authenticated
  using (true);

drop policy if exists "public upsert profiles" on public.profiles;
create policy "public upsert profiles" on public.profiles
  for insert to anon, authenticated
  with check (true);

drop policy if exists "public update profiles" on public.profiles;
create policy "public update profiles" on public.profiles
  for update to anon, authenticated
  using (true)
  with check (true);
