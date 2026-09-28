# ADR-001 — Modular Monolith

## Context

O site precisa orquestrar vários domínios (quiz, catálogo, leads, feedback, analytics, attribution)
que evoluem em ritmos diferentes (spec §17-19), mas o MVP tem um único time e um único deploy.
Microserviços adicionariam complexidade operacional sem benefício nessa fase.

## Decision

Modular monolith com Clean Architecture simplificada e DDD-lite. Cada domínio vive em
`src/modules/<nome>/{domain,application,infrastructure,ui}`, com regra de dependência
unidirecional: `ui → application → domain`, e `infrastructure` implementa interfaces
definidas por `domain`/`application` (nunca o contrário). `src/shared` guarda código
transversal (i18n, validação, infraestrutura genérica). Ver `src/modules/*/index.ts` para
os barrels que documentam essa regra por módulo.

## Alternatives

- **Microserviços** — descartado: overhead operacional (deploy, observabilidade, rede) sem
  ganho real para o volume atual.
- **Estrutura flat (tudo em `app/`)** — descartado: mistura regra de negócio com rota,
  dificulta testar scoring/domínio isoladamente da UI.

## Consequences

- Fronteiras de módulo são só convenção de import, não isolamento físico — depende de
  disciplina (lint pode reforçar isso depois, não configurado no T0).
- Fácil extrair um módulo pra serviço próprio no futuro se o volume justificar (§75).

## Status

Accepted — estrutura de diretórios criada e validada (build passa) no T0.
