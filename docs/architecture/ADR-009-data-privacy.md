# ADR-009 — Privacidade e minimização de dados

## Context

O site coleta respostas sobre crianças a partir de pais — dado sensível por natureza,
mesmo sem identificar a criança diretamente. Spec §3.6 e §29 definem o que pode e não
pode ser coletado, e que proteções técnicas são obrigatórias.

## Decision

- **Nunca coletar**: nome da criança, data de nascimento exata, escola, endereço,
  telefone, foto, sobrenome, identificadores desnecessários.
- **Coletar só**: faixa/idade, respostas estruturadas, texto aberto opcional (com aviso
  explícito pra não incluir identificadores — spec §8.3).
- Secrets só server-side: `src/shared/infrastructure/env/env.server.ts` usa
  `import 'server-only'` — quebra o build se importado de um Client Component. Env
  públicas (`NEXT_PUBLIC_*`) ficam num módulo separado (`env.client.ts`), validadas por
  Zod, nunca misturadas com as server-only.
- Isolamento de schema (`nerlev`, ver ADR-003) como camada extra de proteção — nem um
  bug de query alcança dados do outro app que compartilha o projeto Supabase.
- Validação server-side com Zod em toda entrada de usuário (a aplicar em cada Server
  Action/Route Handler conforme os módulos forem implementados, T2+).
- Consentimento separado por propósito (`marketing` vs `editorial_research`, spec §22.7)
  — implementado em T3 pra `editorial_research`: sem marcar o checkbox de consentimento,
  **nada é gravado** (nem o texto aberto, nem uma linha de consentimento "recusado") —
  minimização de dado aplicada até na decisão de não escrever, não só nos campos
  coletados. `marketing` fica pra T4 (quando o lead/email existir).
  `v_open_feedback` (view de análise, spec §41) filtra por `research_consent = true` —
  consentimento é respeitado também na leitura, não só na coleta.

## Alternatives

- **Coletar mais dados "pra garantir"** — descartado explicitamente pela spec (§3.6);
  minimização é requisito, não otimização.
- **Uma env só, sem separar server/client** — descartado: risco real de vazar secret
  pro bundle do client por engano; a separação física em dois arquivos com
  `server-only` torna o erro impossível de passar despercebido (quebra o build).

## Consequences

- Toda feature nova que queira coletar um campo novo precisa justificar contra essa
  lista antes de implementar — não é decisão ad-hoc por módulo.
- Rate limiting, honeypot anti-spam e HTTPS (spec §29) ainda não implementados — entram
  em T6 (Production Hardening).

## Status

Accepted (env server/client split) — parcialmente implementado; RLS/consent/rate
limiting ficam para T2-T6 conforme as tabelas/rotas nascem.
