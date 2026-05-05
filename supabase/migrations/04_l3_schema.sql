-- =============================================================
-- ConcertBuddy  04_l3_schema.sql
-- Level 3 additions — run AFTER 01_schema.sql
-- =============================================================

-- ---------------------------------------------------------
-- Update profiles table with new Level 3 columns
-- ---------------------------------------------------------
alter table profiles
  add column if not exists photo_urls       text[]    default '{}',
  add column if not exists warning_count    int       not null default 0,
  add column if not exists is_suspended     boolean   not null default false,
  add column if not exists suspension_until timestamptz,
  add column if not exists suspension_reason text,
  add column if not exists is_admin         boolean   not null default false,
  add column if not exists is_bot           boolean   not null default false;

-- ---------------------------------------------------------
-- ticket_verifications
-- ---------------------------------------------------------
create table if not exists ticket_verifications (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid not null references auth.users(id) on delete cascade,
  event_id      uuid not null references events(id) on delete cascade,
  ticket_url    text not null,
  status        text not null default 'pending'
                  check (status in ('pending','approved','rejected')),
  rejection_reason text,
  reviewed_by   uuid references auth.users(id),
  reviewed_at   timestamptz,
  created_at    timestamptz not null default now(),
  unique (user_id, event_id)
);

-- ---------------------------------------------------------
-- id_verifications
-- ---------------------------------------------------------
create table if not exists id_verifications (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid not null references auth.users(id) on delete cascade unique,
  id_image_url  text not null,
  status        text not null default 'pending'
                  check (status in ('pending','approved','rejected')),
  rejection_reason text,
  reviewed_by   uuid references auth.users(id),
  reviewed_at   timestamptz,
  created_at    timestamptz not null default now()
);

-- ---------------------------------------------------------
-- disputes
-- ---------------------------------------------------------
create table if not exists disputes (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid not null references auth.users(id) on delete cascade,
  ban_reason    text not null,
  description   text not null,
  media_urls    text[] default '{}',
  status        text not null default 'pending'
                  check (status in ('pending','approved','rejected')),
  admin_reply   text,
  reviewed_by   uuid references auth.users(id),
  reviewed_at   timestamptz,
  created_at    timestamptz not null default now()
);

-- ---------------------------------------------------------
-- blocks
-- ---------------------------------------------------------
create table if not exists blocks (
  id            uuid primary key default gen_random_uuid(),
  blocker_id    uuid not null references auth.users(id) on delete cascade,
  blocked_id    uuid not null references auth.users(id) on delete cascade,
  created_at    timestamptz not null default now(),
  unique (blocker_id, blocked_id)
);

-- Indexes
create index if not exists ticket_verifications_user_id_idx  on ticket_verifications (user_id);
create index if not exists ticket_verifications_event_id_idx on ticket_verifications (event_id);
create index if not exists ticket_verifications_status_idx   on ticket_verifications (status);
create index if not exists id_verifications_status_idx       on id_verifications (status);
create index if not exists disputes_status_idx               on disputes (status);
create index if not exists blocks_blocker_idx                on blocks (blocker_id);
create index if not exists blocks_blocked_idx                on blocks (blocked_id);
