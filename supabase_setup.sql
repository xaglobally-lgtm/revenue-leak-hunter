-- Revenue Leak Hunter -- shared-project persistence table for Supabase
-- Run this in Supabase: Dashboard -> SQL Editor -> paste -> Run.
-- Creates ONE table (rlh_entities) that holds all RLH data as JSON rows,
-- namespaced so it can safely live in a database shared with other apps.

create table if not exists public.rlh_entities (
  entity     text        not null,
  id         text        not null,
  payload    jsonb       not null,
  created_at timestamptz not null default now(),
  primary key (entity, id)
);

alter table public.rlh_entities enable row level security;

-- The app talks to Supabase with the public "anon" key (PostgREST role: anon).
-- This policy allows that key to read/write THIS table only; all other tables
-- in the project stay closed to it.
drop policy if exists "rlh_anon_all" on public.rlh_entities;
create policy "rlh_anon_all" on public.rlh_entities
  for all
  to anon
  using (true)
  with check (true);

-- Ensure the anon/authenticated roles have rights on the table (Supabase does
-- not grant rights on newly created tables automatically).
grant select, insert, update, delete on public.rlh_entities to anon, authenticated;