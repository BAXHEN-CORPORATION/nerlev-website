-- Fix: RLS policies alone don't grant access — Postgres requires the base table-level
-- GRANT before RLS policies are even evaluated. The previous migration only granted
-- schema-level USAGE, not table-level privileges. Caught via live testing (PostgREST
-- "permission denied for table quiz_sessions").

grant select, insert, update on nerlev.quiz_sessions to anon;
grant select, insert on nerlev.quiz_answers to anon;
grant select, insert on nerlev.quiz_theme_scores to anon;
