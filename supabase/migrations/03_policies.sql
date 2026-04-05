-- =============================================================
-- ConcertBuddy  03_policies.sql
-- Row Level Security — run AFTER 01_schema.sql
-- =============================================================

-- Enable RLS on every user-facing table
alter table profiles   enable row level security;
alter table attendance  enable row level security;
alter table swipes      enable row level security;
alter table matches     enable row level security;
alter table messages    enable row level security;
alter table reports     enable row level security;
alter table ratings     enable row level security;

-- venues and events are public read (no RLS needed for reads,
-- but we restrict writes to service role only)
alter table venues  enable row level security;
alter table events  enable row level security;

-- =============================================================
-- VENUES & EVENTS — public read, service-role write
-- =============================================================
create policy "Venues are publicly readable"
  on venues for select using (true);

create policy "Events are publicly readable"
  on events for select using (true);

-- =============================================================
-- PROFILES
-- =============================================================
create policy "Profiles are publicly readable"
  on profiles for select using (true);

create policy "Users can insert their own profile"
  on profiles for insert
  with check (auth.uid() = id);

create policy "Users can update their own profile"
  on profiles for update
  using (auth.uid() = id);

-- =============================================================
-- ATTENDANCE
-- =============================================================
create policy "Verified attendance is publicly readable"
  on attendance for select
  using (ticket_verified = true);

create policy "Users can register their own attendance"
  on attendance for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own attendance"
  on attendance for update
  using (auth.uid() = user_id);

-- =============================================================
-- SWIPES — private to the swiper
-- =============================================================
create policy "Users can read their own swipes"
  on swipes for select
  using (auth.uid() = swiper_id);

create policy "Users can insert their own swipes"
  on swipes for insert
  with check (auth.uid() = swiper_id);

-- =============================================================
-- MATCHES — readable by both matched users
-- =============================================================
create policy "Matched users can read their match"
  on matches for select
  using (auth.uid() = user1_id or auth.uid() = user2_id);

-- Matches are created server-side (service role), so no insert policy for users.

create policy "Matched users can deactivate their match"
  on matches for update
  using (auth.uid() = user1_id or auth.uid() = user2_id);

-- =============================================================
-- MESSAGES — readable & writable by match participants only
-- =============================================================
create policy "Match participants can read messages"
  on messages for select
  using (
    exists (
      select 1 from matches m
      where m.id = match_id
        and (m.user1_id = auth.uid() or m.user2_id = auth.uid())
        and m.active = true
    )
  );

create policy "Match participants can send messages"
  on messages for insert
  with check (
    auth.uid() = sender_id
    and exists (
      select 1 from matches m
      where m.id = match_id
        and (m.user1_id = auth.uid() or m.user2_id = auth.uid())
        and m.active = true
    )
  );

-- =============================================================
-- REPORTS — reporter can insert; admin reads via service role
-- =============================================================
create policy "Users can submit reports"
  on reports for insert
  with check (auth.uid() = reporter_id);

create policy "Users can read their own submitted reports"
  on reports for select
  using (auth.uid() = reporter_id);

-- =============================================================
-- RATINGS — rater can insert; public can read
-- =============================================================
create policy "Ratings are publicly readable"
  on ratings for select using (true);

create policy "Users can submit ratings for their own matches"
  on ratings for insert
  with check (
    auth.uid() = rater_id
    and exists (
      select 1 from matches m
      where m.id = match_id
        and (m.user1_id = auth.uid() or m.user2_id = auth.uid())
    )
  );
