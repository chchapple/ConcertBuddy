-- =============================================================
-- ConcertBuddy  01_schema.sql
-- Run on a clean Supabase project before 02_seed.sql
-- =============================================================

-- Enable UUID helper
create extension if not exists "pgcrypto";

-- =============================================================
-- VENUES
-- =============================================================
create table if not exists venues (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  address     text not null,
  city        text not null default 'Chico',
  state       text not null default 'CA',
  floor_plan_url text,
  created_at  timestamptz not null default now()
);

-- =============================================================
-- EVENTS
-- =============================================================
create table if not exists events (
  id          uuid primary key default gen_random_uuid(),
  venue_id    uuid not null references venues(id) on delete cascade,
  artist      text not null,
  description text,
  event_date  timestamptz not null,
  ticket_url  text,
  poster_url  text,
  created_at  timestamptz not null default now()
);

-- =============================================================
-- PROFILES  (extends Supabase auth.users 1-to-1)
-- =============================================================
create table if not exists profiles (
  id              uuid primary key references auth.users(id) on delete cascade,
  display_name    text not null,
  bio             text,
  age             int check (age >= 18 and age <= 100),
  gender          text check (gender in ('man','woman','non-binary','prefer not to say')),
  favorite_artists text[],
  favorite_genres  text[],
  has_ride        boolean not null default false,
  photo_url       text,
  avg_rating      numeric(3,2) default null,
  is_suspended    boolean not null default false,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

-- Keep updated_at current automatically
create or replace function set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger profiles_updated_at
  before update on profiles
  for each row execute procedure set_updated_at();

-- =============================================================
-- ATTENDANCE  (verified ticket holders per event)
-- =============================================================
create table if not exists attendance (
  id              uuid primary key default gen_random_uuid(),
  user_id         uuid not null references profiles(id) on delete cascade,
  event_id        uuid not null references events(id) on delete cascade,
  ticket_verified boolean not null default false,
  created_at      timestamptz not null default now(),
  unique (user_id, event_id)
);

-- =============================================================
-- SWIPES
-- =============================================================
create table if not exists swipes (
  id          uuid primary key default gen_random_uuid(),
  swiper_id   uuid not null references profiles(id) on delete cascade,
  swiped_id   uuid not null references profiles(id) on delete cascade,
  event_id    uuid not null references events(id) on delete cascade,
  direction   text not null check (direction in ('like','pass')),
  created_at  timestamptz not null default now(),
  unique (swiper_id, swiped_id, event_id),
  check (swiper_id <> swiped_id)
);

-- =============================================================
-- MATCHES  (mutual likes within an event)
-- =============================================================
create table if not exists matches (
  id          uuid primary key default gen_random_uuid(),
  user1_id    uuid not null references profiles(id) on delete cascade,
  user2_id    uuid not null references profiles(id) on delete cascade,
  event_id    uuid not null references events(id) on delete cascade,
  active      boolean not null default true,
  created_at  timestamptz not null default now(),
  unique (user1_id, user2_id, event_id),
  check (user1_id < user2_id)   -- canonical ordering prevents duplicate pairs
);

-- =============================================================
-- MESSAGES
-- =============================================================
create table if not exists messages (
  id          uuid primary key default gen_random_uuid(),
  match_id    uuid not null references matches(id) on delete cascade,
  sender_id   uuid not null references profiles(id) on delete cascade,
  content     text,
  media_url   text,
  msg_type    text not null default 'text' check (msg_type in ('text','image')),
  created_at  timestamptz not null default now(),
  check (
    (msg_type = 'text'  and content  is not null) or
    (msg_type = 'image' and media_url is not null)
  )
);

-- =============================================================
-- REPORTS
-- =============================================================
create table if not exists reports (
  id              uuid primary key default gen_random_uuid(),
  reporter_id     uuid not null references profiles(id) on delete cascade,
  reported_id     uuid not null references profiles(id) on delete cascade,
  event_id        uuid references events(id) on delete set null,
  reason          text not null,
  reviewed        boolean not null default false,
  reviewed_at     timestamptz,
  created_at      timestamptz not null default now(),
  check (reporter_id <> reported_id)
);

-- =============================================================
-- RATINGS  (post-event, match-scoped)
-- =============================================================
create table if not exists ratings (
  id          uuid primary key default gen_random_uuid(),
  rater_id    uuid not null references profiles(id) on delete cascade,
  rated_id    uuid not null references profiles(id) on delete cascade,
  match_id    uuid not null references matches(id) on delete cascade,
  stars       int  not null check (stars between 1 and 5),
  tags        text[],
  created_at  timestamptz not null default now(),
  unique (rater_id, match_id),
  check (rater_id <> rated_id)
);

-- =============================================================
-- INDEXES  (common query paths)
-- =============================================================
create index if not exists idx_events_date        on events(event_date);
create index if not exists idx_events_venue        on events(venue_id);
create index if not exists idx_attendance_event    on attendance(event_id);
create index if not exists idx_attendance_user     on attendance(user_id);
create index if not exists idx_swipes_event        on swipes(event_id);
create index if not exists idx_matches_user1       on matches(user1_id);
create index if not exists idx_matches_user2       on matches(user2_id);
create index if not exists idx_messages_match      on messages(match_id, created_at);
create index if not exists idx_reports_reviewed    on reports(reviewed);
