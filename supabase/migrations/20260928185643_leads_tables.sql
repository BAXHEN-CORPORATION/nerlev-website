-- Lead Engine tables (spec §22.5-22.6) — schema `nerlev` only, see ADR-003. Also
-- completes the FK on `consent_records.lead_id` that T3 deliberately left off (this
-- table didn't exist yet).

create table nerlev.leads (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  locale text not null,
  created_at timestamptz not null default now()
);

create table nerlev.lead_quiz_sessions (
  lead_id uuid not null references nerlev.leads (id) on delete cascade,
  session_id uuid not null references nerlev.quiz_sessions (id) on delete cascade,
  primary key (lead_id, session_id)
);

alter table nerlev.consent_records
  add constraint consent_records_lead_id_fkey
  foreign key (lead_id) references nerlev.leads (id) on delete set null;

alter table nerlev.leads enable row level security;
alter table nerlev.lead_quiz_sessions enable row level security;

-- Table-level GRANT before RLS policies (same lesson from the quiz tables migration).
grant select, insert, update on nerlev.leads to anon;
grant select, insert on nerlev.lead_quiz_sessions to anon;

create policy "anon can insert leads" on nerlev.leads
  for insert to anon with check (true);
create policy "anon can select leads" on nerlev.leads
  for select to anon using (true);
create policy "anon can update leads" on nerlev.leads
  for update to anon using (true) with check (true);

create policy "anon can insert lead_quiz_sessions" on nerlev.lead_quiz_sessions
  for insert to anon with check (true);
create policy "anon can select lead_quiz_sessions" on nerlev.lead_quiz_sessions
  for select to anon using (true);
