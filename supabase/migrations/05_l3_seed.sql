-- =============================================================
-- ConcertBuddy  05_l3_seed.sql
-- Level 3 seed additions — run AFTER 04_l3_schema.sql
-- =============================================================

-- ---------------------------------------------------------
-- Buddy Bot auth user
-- ---------------------------------------------------------
insert into auth.users (
  id, email, encrypted_password, email_confirmed_at,
  raw_app_meta_data, raw_user_meta_data, aud, role, created_at, updated_at
) values (
  '00000000-0000-0000-0000-000000000000',
  'buddybot@concertbuddy.app',
  crypt('!!bot-no-login!!', gen_salt('bf')),
  now(),
  '{"provider":"email","providers":["email"]}'::jsonb, '{}'::jsonb,
  'authenticated', 'authenticated', now(), now()
) on conflict (id) do nothing;

-- Buddy Bot profile
insert into profiles (id, display_name, bio, photo_url, photo_urls, is_bot, is_admin) values (
  '00000000-0000-0000-0000-000000000000',
  'Buddy Bot',
  'Your official ConcertBuddy assistant 🤖',
  'https://api.dicebear.com/7.x/bottts/svg?seed=buddybot',
  ARRAY['https://api.dicebear.com/7.x/bottts/svg?seed=buddybot'],
  true, false
) on conflict (id) do nothing;

-- ---------------------------------------------------------
-- Admin user
-- ---------------------------------------------------------
insert into auth.users (
  id, email, encrypted_password, email_confirmed_at,
  raw_app_meta_data, raw_user_meta_data, aud, role, created_at, updated_at
) values (
  'ad000000-0000-0000-0000-000000000001',
  'admin@concertbuddy.app',
  crypt('Admin1234!', gen_salt('bf')),
  now(),
  '{"provider":"email","providers":["email"]}'::jsonb, '{}'::jsonb,
  'authenticated', 'authenticated', now(), now()
) on conflict (id) do nothing;

insert into profiles (id, display_name, bio, photo_url, is_admin) values (
  'ad000000-0000-0000-0000-000000000001',
  'Admin',
  'ConcertBuddy administrator',
  'https://api.dicebear.com/7.x/identicon/svg?seed=admin',
  true
) on conflict (id) do nothing;

-- ---------------------------------------------------------
-- Update existing seed profiles with photo_urls arrays
-- ---------------------------------------------------------
update profiles set
  photo_urls = ARRAY[photo_url,
    'https://i.pravatar.cc/150?img=12',
    'https://i.pravatar.cc/150?img=13']
where id = 'c1000000-0000-0000-0000-000000000001' and photo_urls = '{}';

update profiles set
  photo_urls = ARRAY[photo_url,
    'https://i.pravatar.cc/150?img=23',
    'https://i.pravatar.cc/150?img=24']
where id = 'c1000000-0000-0000-0000-000000000002' and photo_urls = '{}';

update profiles set
  photo_urls = ARRAY[photo_url,
    'https://i.pravatar.cc/150?img=34',
    'https://i.pravatar.cc/150?img=35']
where id = 'c1000000-0000-0000-0000-000000000003' and photo_urls = '{}';

update profiles set
  photo_urls = ARRAY[photo_url,
    'https://i.pravatar.cc/150?img=45',
    'https://i.pravatar.cc/150?img=46']
where id = 'c1000000-0000-0000-0000-000000000004' and photo_urls = '{}';

update profiles set
  photo_urls = ARRAY[photo_url,
    'https://i.pravatar.cc/150?img=56',
    'https://i.pravatar.cc/150?img=57']
where id = 'c1000000-0000-0000-0000-000000000005' and photo_urls = '{}';

-- ---------------------------------------------------------
-- Ticket verifications (mix of statuses for demo)
-- ---------------------------------------------------------
insert into ticket_verifications (user_id, event_id, ticket_url, status) values
  ('c1000000-0000-0000-0000-000000000001', 'b1000000-0000-0000-0000-000000000001',
   'https://picsum.photos/seed/tix1/400/200', 'approved'),
  ('c1000000-0000-0000-0000-000000000002', 'b1000000-0000-0000-0000-000000000001',
   'https://picsum.photos/seed/tix2/400/200', 'approved'),
  ('c1000000-0000-0000-0000-000000000003', 'b1000000-0000-0000-0000-000000000002',
   'https://picsum.photos/seed/tix3/400/200', 'pending'),
  ('c1000000-0000-0000-0000-000000000004', 'b1000000-0000-0000-0000-000000000003',
   'https://picsum.photos/seed/tix4/400/200', 'rejected'),
  ('c1000000-0000-0000-0000-000000000005', 'b1000000-0000-0000-0000-000000000001',
   'https://picsum.photos/seed/tix5/400/200', 'pending')
on conflict (user_id, event_id) do nothing;

-- ---------------------------------------------------------
-- ID verifications (mix of statuses)
-- ---------------------------------------------------------
insert into id_verifications (user_id, id_image_url, status) values
  ('c1000000-0000-0000-0000-000000000001', 'https://picsum.photos/seed/id1/400/200', 'approved'),
  ('c1000000-0000-0000-0000-000000000002', 'https://picsum.photos/seed/id2/400/200', 'pending'),
  ('c1000000-0000-0000-0000-000000000003', 'https://picsum.photos/seed/id3/400/200', 'rejected')
on conflict (user_id) do nothing;

-- ---------------------------------------------------------
-- Disputes
-- ---------------------------------------------------------
insert into disputes (user_id, ban_reason, description, status) values
  ('c1000000-0000-0000-0000-000000000004',
   'Harassment',
   'I was suspended for harassment but the other user provoked me first. I have screenshots.',
   'pending'),
  ('c1000000-0000-0000-0000-000000000005',
   'Spam',
   'I was sending event recommendations not spam. Please review my account.',
   'rejected')
on conflict do nothing;

-- ---------------------------------------------------------
-- Buddy Bot welcome messages for existing matches
-- ---------------------------------------------------------
insert into messages (match_id, sender_id, content, msg_type) values
  ('d1000000-0000-0000-0000-000000000001',
   '00000000-0000-0000-0000-000000000000',
   '👋 Hey! You matched with Jordan Lee at **The Midnight** show. Say hi!',
   'text'),
  ('d1000000-0000-0000-0000-000000000001',
   '00000000-0000-0000-0000-000000000000',
   '🎟️ Your ticket for **The Midnight** has been approved! You can now browse attendees.',
   'text')
on conflict do nothing;
