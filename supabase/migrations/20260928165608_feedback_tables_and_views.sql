-- Research Layer tables (spec §22.4, §22.7) — schema `nerlev` only, see ADR-003.
-- Same anonymous-session RLS limitation as quiz tables (ADR-006/ADR-009): permissive by
-- role, not by row owner. `consent_records.lead_id` has no FK yet — `nerlev.leads` is
-- created in T4, which will add `alter table ... add constraint ...` for it.

create table nerlev.open_feedback (
  id uuid primary key default gen_random_uuid(),
  session_id uuid not null references nerlev.quiz_sessions (id) on delete cascade,
  feedback_type text not null check (feedback_type in ('current_challenge', 'desired_growth')),
  original_text text not null,
  locale text not null,
  research_consent boolean not null default false,
  created_at timestamptz not null default now()
);

create index open_feedback_session_id_idx on nerlev.open_feedback (session_id);

create table nerlev.consent_records (
  id uuid primary key default gen_random_uuid(),
  lead_id uuid,
  session_id uuid references nerlev.quiz_sessions (id) on delete cascade,
  purpose text not null check (purpose in ('editorial_research', 'marketing')),
  policy_version text not null,
  granted_at timestamptz not null default now(),
  withdrawn_at timestamptz
);

create index consent_records_session_id_idx on nerlev.consent_records (session_id);

alter table nerlev.open_feedback enable row level security;
alter table nerlev.consent_records enable row level security;

-- Table-level GRANT is required before RLS policies are even evaluated (learned the hard
-- way on the quiz tables migration — a first attempt without these failed with
-- "permission denied for table" despite policies being in place).
grant select, insert on nerlev.open_feedback to anon;
grant select, insert on nerlev.consent_records to anon;

create policy "anon can insert open_feedback" on nerlev.open_feedback
  for insert to anon with check (true);
create policy "anon can select open_feedback" on nerlev.open_feedback
  for select to anon using (true);

create policy "anon can insert consent_records" on nerlev.consent_records
  for insert to anon with check (true);
create policy "anon can select consent_records" on nerlev.consent_records
  for select to anon using (true);

-- Manual-analysis views (spec §41) — read via Supabase Studio / SQL, not exposed to
-- `anon` (no grants given on the views themselves), matching "no custom dashboard in
-- the MVP" (§41). All built from data that already exists since T2, no PostHog needed.

create view nerlev.v_quiz_funnel as
select
  count(*) as sessions_started,
  count(completed_at) as sessions_completed,
  round(count(completed_at)::numeric / nullif(count(*), 0) * 100, 1) as completion_rate_pct
from nerlev.quiz_sessions;

create view nerlev.v_theme_demand as
select primary_theme_id as theme_id, count(*) as session_count
from nerlev.quiz_sessions
where primary_theme_id is not null
group by primary_theme_id
order by session_count desc;

create view nerlev.v_theme_by_age as
select child_age_band, primary_theme_id as theme_id, count(*) as session_count
from nerlev.quiz_sessions
where primary_theme_id is not null and child_age_band is not null
group by child_age_band, primary_theme_id
order by child_age_band, session_count desc;

create view nerlev.v_theme_by_locale as
select locale, primary_theme_id as theme_id, count(*) as session_count
from nerlev.quiz_sessions
where primary_theme_id is not null
group by locale, primary_theme_id
order by locale, session_count desc;

create view nerlev.v_open_feedback as
select
  f.id,
  f.session_id,
  f.feedback_type,
  f.original_text,
  f.locale,
  f.created_at,
  s.primary_theme_id,
  s.child_age_band
from nerlev.open_feedback f
join nerlev.quiz_sessions s on s.id = f.session_id
where f.research_consent = true
order by f.created_at desc;

create view nerlev.v_attribution_by_content as
select
  utm_content,
  utm_source,
  utm_campaign,
  count(*) as sessions_started,
  count(completed_at) as sessions_completed
from nerlev.quiz_sessions
where utm_content is not null
group by utm_content, utm_source, utm_campaign
order by sessions_started desc;
