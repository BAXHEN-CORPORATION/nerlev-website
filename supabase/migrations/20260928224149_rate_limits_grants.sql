-- Fix for 20260928213650_rate_limits.sql: RLS-bypass and table-level GRANT are
-- orthogonal in Postgres — service_role bypasses RLS policies, but still needs an
-- explicit table GRANT (confirmed by the exact error Postgres returns: "permission
-- denied for table rate_limits", same class of gotcha as the T2 quiz_tables fix, just
-- for service_role instead of anon). anon gets nothing here — only service_role calls
-- this table/function.

grant select, insert, update on nerlev.rate_limits to service_role;
grant execute on function nerlev.rate_limit_hit(text, integer, integer) to service_role;
