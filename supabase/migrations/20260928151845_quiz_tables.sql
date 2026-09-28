-- Quiz Engine tables (spec §22.1-22.3), schema `nerlev` only — see ADR-003.
-- Sessions are anonymous (ADR-006): no auth.uid(), so RLS below is permissive by design.
-- Real protection is data minimization (no PII) + unguessable UUIDs, not row ACLs.
-- Documented limitation — revisit in T6 (Production Hardening) if it needs tightening.

create table nerlev.quiz_sessions (
  id uuid primary key default gen_random_uuid(),
  quiz_version int not null,
  scoring_version int not null,
  locale text not null,
  child_age_band text,
  utm_source text,
  utm_medium text,
  utm_campaign text,
  utm_content text,
  referrer text,
  started_at timestamptz not null default now(),
  completed_at timestamptz,
  primary_theme_id text,
  secondary_theme_id text
);

create table nerlev.quiz_answers (
  id uuid primary key default gen_random_uuid(),
  session_id uuid not null references nerlev.quiz_sessions (id) on delete cascade,
  question_id text not null,
  answer_id text not null,
  answered_at timestamptz not null default now()
);

create index quiz_answers_session_id_idx on nerlev.quiz_answers (session_id);

create table nerlev.quiz_theme_scores (
  id uuid primary key default gen_random_uuid(),
  session_id uuid not null references nerlev.quiz_sessions (id) on delete cascade,
  theme_id text not null,
  score int not null,
  rank int not null
);

create index quiz_theme_scores_session_id_idx on nerlev.quiz_theme_scores (session_id);

alter table nerlev.quiz_sessions enable row level security;
alter table nerlev.quiz_answers enable row level security;
alter table nerlev.quiz_theme_scores enable row level security;

-- Anonymous flow: anon needs to create a session, append answers, and read back its
-- own result after completion. No per-row ownership check is possible without auth.
create policy "anon can insert quiz_sessions" on nerlev.quiz_sessions
  for insert to anon with check (true);
create policy "anon can select quiz_sessions" on nerlev.quiz_sessions
  for select to anon using (true);
create policy "anon can update quiz_sessions" on nerlev.quiz_sessions
  for update to anon using (true) with check (true);

create policy "anon can insert quiz_answers" on nerlev.quiz_answers
  for insert to anon with check (true);
create policy "anon can select quiz_answers" on nerlev.quiz_answers
  for select to anon using (true);

create policy "anon can insert quiz_theme_scores" on nerlev.quiz_theme_scores
  for insert to anon with check (true);
create policy "anon can select quiz_theme_scores" on nerlev.quiz_theme_scores
  for select to anon using (true);
