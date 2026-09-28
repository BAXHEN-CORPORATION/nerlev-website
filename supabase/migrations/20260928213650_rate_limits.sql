-- T6 hardening (spec §29): rate limiting for abuse-prone Server Actions/routes.
-- Only the service-role client calls this (see src/shared/rate-limit/check-rate-limit.ts).
-- `anon` gets zero access — no GRANT, no RLS policy for it — since it never touches this
-- table. service_role still needs its own explicit GRANT despite bypassing RLS (RLS-bypass
-- and table-level privilege are separate mechanisms in Postgres) — see the follow-up
-- migration 20260928224149_rate_limits_grants.sql for that fix, found by testing against
-- the real database (same class of gotcha as T2's quiz_tables_grants.sql, one role over).

create table nerlev.rate_limits (
  bucket_key text primary key,
  window_start timestamptz not null default now(),
  count integer not null default 0
);

alter table nerlev.rate_limits enable row level security;
-- Deliberately zero policies — default-deny for anon/authenticated. Service role bypasses RLS.

-- Atomic check-and-increment: resets the counter when the window has elapsed, otherwise
-- increments. Row-level lock from the upsert makes this safe under concurrent requests
-- for the same bucket_key.
create or replace function nerlev.rate_limit_hit(
  p_key text,
  p_limit integer,
  p_window_seconds integer
) returns boolean
language plpgsql
as $$
declare
  v_count integer;
begin
  insert into nerlev.rate_limits (bucket_key, window_start, count)
  values (p_key, now(), 1)
  on conflict (bucket_key) do update
    set count = case
        when nerlev.rate_limits.window_start < now() - (p_window_seconds || ' seconds')::interval
          then 1
        else nerlev.rate_limits.count + 1
      end,
      window_start = case
        when nerlev.rate_limits.window_start < now() - (p_window_seconds || ' seconds')::interval
          then now()
        else nerlev.rate_limits.window_start
      end
  returning count into v_count;

  return v_count <= p_limit;
end;
$$;
