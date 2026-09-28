# ADR-006 — Sessões de quiz anônimas, sem login

## Context

O MVP não tem conta de pais nem login (spec §43, §58-59) — o quiz precisa funcionar sem
identificar a pessoa além do necessário pra recomendação e pesquisa editorial (§3.6, §29).

## Decision

Sessões de quiz identificadas só por `session_id` (a criar em T2, tabela
`nerlev.quiz_sessions`), sem vínculo a conta de usuário. Lead (email) é opcional e
vinculado à sessão só depois do resultado (`lead_quiz_sessions`), nunca obrigatório pra
ver o resultado (§14). Sem `auth.users` do Supabase envolvido nessa fase — não há
autenticação real no MVP.

Implementado em T2: `nerlev.quiz_sessions`/`quiz_answers`/`quiz_theme_scores` (migration
`20260928151845_quiz_tables.sql`), sem qualquer referência a `auth.users`. RLS é
permissiva por role (`anon`), não por dono de linha — não dá pra restringir por
"dono da sessão" sem autenticação real. Ver nota de segurança na migration e no plano de
implementação; endurecer em T6 se necessário.

## Alternatives

- **Conta de pais desde o início** — descartado, spec explícita: login só quando houver
  valor real comprovado (§59), não antecipar.
- **Sessão vinculada a device/cookie de longo prazo** — não descartado, mas fora de
  escopo do MVP; reavaliar em T2 se precisar retomar quiz incompleto.

## Consequences

- Nenhuma tabela do MVP deve exigir `auth.uid()` nas policies de RLS — elas vão se
  apoiar em `session_id` gerado no servidor.
- Reaplicação do questionário (spec §60) e histórico por pai (spec §58) exigem login
  futuro — a estrutura de sessão anônima precisa deixar espaço pra vincular depois sem
  reescrever o modelo (ex: `lead_id` nullable já nasce assim).

## Status

Accepted — implementado e validado end-to-end.
