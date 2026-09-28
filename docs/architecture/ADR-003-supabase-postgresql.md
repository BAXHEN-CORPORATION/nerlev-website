# ADR-003 — Supabase/PostgreSQL em projeto compartilhado, schema isolado

## Context

Spec (§22, §32, §39) pede PostgreSQL via Supabase, sem ORM, schema versionado como código.
Durante o T0, decisão adicional do usuário: em vez de provisionar um projeto Supabase
dedicado, reusar acesso a um projeto Supabase já existente (compartilhado com outro app).

## Decision

- Sem ORM — `supabase-js` direto + repositories por módulo (a implementar em T2+) + Zod
  pra validação.
- **Schema Postgres dedicado `nerlev`** dentro do projeto compartilhado — nunca
  `public.*` (que pertence ao outro app). Toda migration abre com
  `create schema if not exists nerlev` e qualifica DDL dentro dele.
  `supabase/config.toml` expõe `nerlev` via `[api].schemas`.
- Cliente sempre schema-scoped: `createClient(url, key, { db: { schema: 'nerlev' } })`
  (`src/shared/infrastructure/supabase/client.ts`) — nunca overridar pra outro schema.
- Sem Docker/`supabase start` local no T0 — CLI aponta direto pro projeto remoto via
  `SUPABASE_DB_URL` (pooler). Migrations aplicadas com `supabase db push --db-url`,
  nunca `db pull` (risco de dumpar schema do outro projeto).
- Migrations versionadas em `supabase/migrations/`, primeira migration já aplicada no
  banco remoto (`20260928131006_create_nerlev_schema.sql`).

## Alternatives

- **Projeto Supabase dedicado** (assumido inicialmente) — adiado por decisão do usuário;
  reavaliar quando fizer sentido ter DB próprio (menos risco de acoplamento entre apps).
- **ORM (Drizzle/Prisma)** — descartado no MVP, spec pede reavaliar só se queries
  crescerem em complexidade (§32).
- **`supabase start` local com Docker** — adiado, sem Docker disponível/desejado agora.

## Consequences

- Qualquer migration futura precisa disciplina pra nunca sair do schema `nerlev` —
  risco real de vazar pro `public` do outro app se alguém esquecer de qualificar.
- Sem stack local Postgres pra desenvolvimento offline — todo teste de integração real
  (T2+) precisa de rede até o projeto remoto.
- Migrar pra projeto dedicado no futuro é direto: `pg_dump --schema=nerlev` + restore.

## Status

Accepted — schema criado e confirmado no banco remoto (`supabase migration list`), client
factory implementado e buildando.
