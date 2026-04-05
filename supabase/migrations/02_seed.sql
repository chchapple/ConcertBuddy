-- =============================================================
-- ConcertBuddy  02_seed.sql
-- Realistic test data — run AFTER 01_schema.sql
-- NOTE: profiles reference auth.users, so we insert placeholder
--       UUIDs that must exist in auth.users in a real deployment.
--       For SQL-editor testing, wrap in a transaction so you can
--       roll back if auth rows are absent.
-- =============================================================

-- Stable UUIDs for seed users (use these same IDs in auth.users)
-- u1 = Alex Rivera   u2 = Jordan Lee   u3 = Sam Patel
-- u4 = Morgan Kim    u5 = Casey Torres
do $$ begin
  -- Skip seed if profiles already populated
  if exists (select 1 from profiles limit 1) then
    raise notice 'Seed already applied – skipping.';
    return;
  end if;
end $$;

-- =============================================================
-- VENUES (4 Chico-area venues)
-- =============================================================
insert into venues (id, name, address, city, state) values
  ('a1000000-0000-0000-0000-000000000001', 'Senator Theatre',         '341 Main St',        'Chico', 'CA'),
  ('a1000000-0000-0000-0000-000000000002', 'Duffy''s Tavern',         '337 Main St',        'Chico', 'CA'),
  ('a1000000-0000-0000-0000-000000000003', 'LaSalles',                '229 Broadway St',    'Chico', 'CA'),
  ('a1000000-0000-0000-0000-000000000004', 'Chico Women''s Club',     '592 E 3rd St',       'Chico', 'CA')
on conflict (id) do nothing;

-- =============================================================
-- EVENTS (5 upcoming concerts)
-- =============================================================
insert into events (id, venue_id, artist, description, event_date) values
  ('b1000000-0000-0000-0000-000000000001',
   'a1000000-0000-0000-0000-000000000001',
   'The Midnight',
   'Synthwave headliners The Midnight bring their "Heroes" tour to Chico.',
   now() + interval '14 days'),

  ('b1000000-0000-0000-0000-000000000002',
   'a1000000-0000-0000-0000-000000000002',
   'Hippo Campus',
   'Indie-rock favorites Hippo Campus headline a sold-out show at Duffy''s.',
   now() + interval '21 days'),

  ('b1000000-0000-0000-0000-000000000003',
   'a1000000-0000-0000-0000-000000000003',
   'Still Woozy',
   'Bay Area bedroom-pop artist Still Woozy stops in Chico.',
   now() + interval '30 days'),

  ('b1000000-0000-0000-0000-000000000004',
   'a1000000-0000-0000-0000-000000000001',
   'Mt. Joy',
   'Folk-rock outfit Mt. Joy performs tracks from their latest album.',
   now() + interval '45 days'),

  ('b1000000-0000-0000-0000-000000000005',
   'a1000000-0000-0000-0000-000000000004',
   'Local Natives',
   'Indie-rock veterans Local Natives at the intimate Chico Women''s Club.',
   now() + interval '60 days')
on conflict (id) do nothing;

-- =============================================================
-- PROFILES (5 seed users)
-- Requires matching rows in auth.users; in the SQL editor you can
-- temporarily disable the FK check or insert into auth.users first.
-- =============================================================
insert into profiles (id, display_name, bio, age, gender, favorite_artists, favorite_genres, has_ride, photo_url) values
  ('c1000000-0000-0000-0000-000000000001',
   'Alex Rivera',
   'Huge synth-pop fan, always up front at shows. Looking for concert crew!',
   26, 'man',
   ARRAY['The Midnight','Chvrches','M83'],
   ARRAY['synthwave','indie-pop','electronic'],
   true,
   'https://i.pravatar.cc/150?img=11'),

  ('c1000000-0000-0000-0000-000000000002',
   'Jordan Lee',
   'Indie music lover, I go to at least two shows a month.',
   23, 'woman',
   ARRAY['Hippo Campus','Still Woozy','Phoebe Bridgers'],
   ARRAY['indie-rock','folk','bedroom-pop'],
   false,
   'https://i.pravatar.cc/150?img=22'),

  ('c1000000-0000-0000-0000-000000000003',
   'Sam Patel',
   'Festival veteran, chill vibes only. Big Mt. Joy fan since day one.',
   29, 'non-binary',
   ARRAY['Mt. Joy','Lord Huron','Novo Amor'],
   ARRAY['folk','indie-folk','alternative'],
   true,
   'https://i.pravatar.cc/150?img=33'),

  ('c1000000-0000-0000-0000-000000000004',
   'Morgan Kim',
   'New to Chico — trying to meet people at local shows. Love ambient sounds.',
   21, 'woman',
   ARRAY['Local Natives','Beach House','Washed Out'],
   ARRAY['indie-rock','dream-pop','shoegaze'],
   false,
   'https://i.pravatar.cc/150?img=44'),

  ('c1000000-0000-0000-0000-000000000005',
   'Casey Torres',
   'Bouncer by day, concert-goer by night. Always near the back with a cold drink.',
   31, 'man',
   ARRAY['Still Woozy','Rex Orange County','Clairo'],
   ARRAY['bedroom-pop','indie-pop','lo-fi'],
   true,
   'https://i.pravatar.cc/150?img=55')
on conflict (id) do nothing;

-- =============================================================
-- ATTENDANCE (verified ticket holders per event)
-- =============================================================
insert into attendance (user_id, event_id, ticket_verified) values
  -- The Midnight
  ('c1000000-0000-0000-0000-000000000001', 'b1000000-0000-0000-0000-000000000001', true),
  ('c1000000-0000-0000-0000-000000000002', 'b1000000-0000-0000-0000-000000000001', true),
  ('c1000000-0000-0000-0000-000000000005', 'b1000000-0000-0000-0000-000000000001', false),
  -- Hippo Campus
  ('c1000000-0000-0000-0000-000000000002', 'b1000000-0000-0000-0000-000000000002', true),
  ('c1000000-0000-0000-0000-000000000003', 'b1000000-0000-0000-0000-000000000002', true),
  -- Still Woozy
  ('c1000000-0000-0000-0000-000000000002', 'b1000000-0000-0000-0000-000000000003', true),
  ('c1000000-0000-0000-0000-000000000005', 'b1000000-0000-0000-0000-000000000003', true),
  -- Mt. Joy
  ('c1000000-0000-0000-0000-000000000001', 'b1000000-0000-0000-0000-000000000004', true),
  ('c1000000-0000-0000-0000-000000000003', 'b1000000-0000-0000-0000-000000000004', true),
  ('c1000000-0000-0000-0000-000000000004', 'b1000000-0000-0000-0000-000000000004', true),
  -- Local Natives
  ('c1000000-0000-0000-0000-000000000004', 'b1000000-0000-0000-0000-000000000005', true),
  ('c1000000-0000-0000-0000-000000000003', 'b1000000-0000-0000-0000-000000000005', true)
on conflict (user_id, event_id) do nothing;

-- =============================================================
-- SWIPES (some mutual likes to produce matches)
-- =============================================================
insert into swipes (swiper_id, swiped_id, event_id, direction) values
  -- The Midnight: Alex likes Jordan, Jordan likes Alex (→ match)
  ('c1000000-0000-0000-0000-000000000001', 'c1000000-0000-0000-0000-000000000002', 'b1000000-0000-0000-0000-000000000001', 'like'),
  ('c1000000-0000-0000-0000-000000000002', 'c1000000-0000-0000-0000-000000000001', 'b1000000-0000-0000-0000-000000000001', 'like'),
  -- Hippo Campus: Jordan likes Sam, Sam likes Jordan (→ match)
  ('c1000000-0000-0000-0000-000000000002', 'c1000000-0000-0000-0000-000000000003', 'b1000000-0000-0000-0000-000000000002', 'like'),
  ('c1000000-0000-0000-0000-000000000003', 'c1000000-0000-0000-0000-000000000002', 'b1000000-0000-0000-0000-000000000002', 'like'),
  -- Mt. Joy: Alex likes Sam (no return like yet)
  ('c1000000-0000-0000-0000-000000000001', 'c1000000-0000-0000-0000-000000000003', 'b1000000-0000-0000-0000-000000000004', 'like'),
  -- Mt. Joy: Sam passes on Morgan
  ('c1000000-0000-0000-0000-000000000003', 'c1000000-0000-0000-0000-000000000004', 'b1000000-0000-0000-0000-000000000004', 'pass')
on conflict (swiper_id, swiped_id, event_id) do nothing;

-- =============================================================
-- MATCHES  (canonical: user1_id < user2_id)
-- =============================================================
insert into matches (id, user1_id, user2_id, event_id, active) values
  ('d1000000-0000-0000-0000-000000000001',
   'c1000000-0000-0000-0000-000000000001',
   'c1000000-0000-0000-0000-000000000002',
   'b1000000-0000-0000-0000-000000000001',
   true),
  ('d1000000-0000-0000-0000-000000000002',
   'c1000000-0000-0000-0000-000000000002',
   'c1000000-0000-0000-0000-000000000003',
   'b1000000-0000-0000-0000-000000000002',
   true)
on conflict (user1_id, user2_id, event_id) do nothing;

-- =============================================================
-- MESSAGES
-- =============================================================
insert into messages (match_id, sender_id, content, msg_type) values
  ('d1000000-0000-0000-0000-000000000001',
   'c1000000-0000-0000-0000-000000000001',
   'Hey! Stoked we matched for The Midnight show 🎹', 'text'),
  ('d1000000-0000-0000-0000-000000000001',
   'c1000000-0000-0000-0000-000000000002',
   'Same! Are you getting there early to grab a good spot?', 'text'),
  ('d1000000-0000-0000-0000-000000000001',
   'c1000000-0000-0000-0000-000000000001',
   'For sure. Maybe meet at the merch table around 7?', 'text'),
  ('d1000000-0000-0000-0000-000000000002',
   'c1000000-0000-0000-0000-000000000002',
   'Hey Sam! Hippo Campus is going to be amazing 🎸', 'text'),
  ('d1000000-0000-0000-0000-000000000002',
   'c1000000-0000-0000-0000-000000000003',
   'Can''t wait! Do you have a ride or need one?', 'text')
on conflict do nothing;

-- =============================================================
-- REPORTS
-- =============================================================
insert into reports (reporter_id, reported_id, event_id, reason, reviewed) values
  ('c1000000-0000-0000-0000-000000000004',
   'c1000000-0000-0000-0000-000000000005',
   'b1000000-0000-0000-0000-000000000003',
   'Sent inappropriate messages after unmatching.',
   false),
  ('c1000000-0000-0000-0000-000000000002',
   'c1000000-0000-0000-0000-000000000001',
   'b1000000-0000-0000-0000-000000000001',
   'Profile photo appeared to be fake / catfishing.',
   false),
  ('c1000000-0000-0000-0000-000000000003',
   'c1000000-0000-0000-0000-000000000005',
   null,
   'Harassment outside of the app.',
   true)
on conflict do nothing;

-- =============================================================
-- RATINGS
-- =============================================================
insert into ratings (rater_id, rated_id, match_id, stars, tags) values
  ('c1000000-0000-0000-0000-000000000001',
   'c1000000-0000-0000-0000-000000000002',
   'd1000000-0000-0000-0000-000000000001',
   5, ARRAY['friendly','punctual','great vibe']),
  ('c1000000-0000-0000-0000-000000000002',
   'c1000000-0000-0000-0000-000000000001',
   'd1000000-0000-0000-0000-000000000001',
   4, ARRAY['fun','good conversation'])
on conflict (rater_id, match_id) do nothing;
