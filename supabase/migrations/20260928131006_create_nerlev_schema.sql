-- Dedicated schema for this project. The Supabase project is shared with another
-- app, so every NerLev table/view/function lives here — never in `public`.
-- See ADR-003 (supabase-postgresql) and ADR-006 (anonymous-quiz-sessions).
create schema if not exists nerlev;

grant usage on schema nerlev to anon, authenticated, service_role;

-- Table-level grants and RLS policies are set per-table when each table is created
-- (starting T2), not as a blanket default here — see spec §29 (privacidade).
