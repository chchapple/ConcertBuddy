-- =============================================================
-- ConcertBuddy  06_l3_policies.sql
-- Level 3 RLS policies — run AFTER 04_l3_schema.sql
-- =============================================================

alter table ticket_verifications enable row level security;
alter table id_verifications     enable row level security;
alter table disputes             enable row level security;
alter table blocks               enable row level security;

-- ticket_verifications
create policy "Users can view own ticket verifications"
  on ticket_verifications for select
  using (auth.uid() = user_id or exists (select 1 from profiles where id = auth.uid() and is_admin));

create policy "Users can submit ticket verifications"
  on ticket_verifications for insert
  with check (auth.uid() = user_id);

create policy "Admins can update ticket verifications"
  on ticket_verifications for update
  using (exists (select 1 from profiles where id = auth.uid() and is_admin));

-- id_verifications
create policy "Users can view own id verification"
  on id_verifications for select
  using (auth.uid() = user_id or exists (select 1 from profiles where id = auth.uid() and is_admin));

create policy "Users can submit id verification"
  on id_verifications for insert
  with check (auth.uid() = user_id);

create policy "Admins can update id verifications"
  on id_verifications for update
  using (exists (select 1 from profiles where id = auth.uid() and is_admin));

-- disputes
create policy "Users can view own disputes"
  on disputes for select
  using (auth.uid() = user_id or exists (select 1 from profiles where id = auth.uid() and is_admin));

create policy "Users can submit disputes"
  on disputes for insert
  with check (auth.uid() = user_id);

create policy "Admins can update disputes"
  on disputes for update
  using (exists (select 1 from profiles where id = auth.uid() and is_admin));

-- blocks
create policy "Users can view own blocks"
  on blocks for select
  using (auth.uid() = blocker_id);

create policy "Users can block others"
  on blocks for insert
  with check (auth.uid() = blocker_id);

create policy "Users can unblock"
  on blocks for delete
  using (auth.uid() = blocker_id);
