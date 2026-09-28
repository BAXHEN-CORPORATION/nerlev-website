-- Amazon click tracking (spec §24/§67) — schema `nerlev` only, see ADR-003. Completes
-- the pendency T1 left open ("sem registro no banco ainda — isso é T5"). `session_id` is
-- nullable: the click may come from Home/`/livros` (no quiz session) or from
-- `/resultado/[session]` (session known, passed as `?session=` on the redirect URL).

create table nerlev.amazon_clicks (
  id uuid primary key default gen_random_uuid(),
  book_code text not null,
  session_id uuid references nerlev.quiz_sessions (id) on delete set null,
  utm_source text,
  utm_medium text,
  utm_campaign text,
  utm_content text,
  clicked_at timestamptz not null default now()
);

create index amazon_clicks_session_id_idx on nerlev.amazon_clicks (session_id);
create index amazon_clicks_book_code_idx on nerlev.amazon_clicks (book_code);

alter table nerlev.amazon_clicks enable row level security;

grant select, insert on nerlev.amazon_clicks to anon;

create policy "anon can insert amazon_clicks" on nerlev.amazon_clicks
  for insert to anon with check (true);
create policy "anon can select amazon_clicks" on nerlev.amazon_clicks
  for select to anon using (true);
