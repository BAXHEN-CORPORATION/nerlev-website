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
  consentimento é respeitado também na leitura, não só na coleta. `marketing`
  implementado em T4: opcional e separado do envio do email transacional — recusar
  marketing não impede receber o resultado por email (spec §14: "não obrigar aceitar
  newsletter pra ver o resultado").
- Email transacional (T4) é best-effort: falha no envio (`Resend`) nunca derruba a
  gravação do lead — captura de dado e entrega de email são preocupações separadas.

## Alternatives

- **Coletar mais dados "pra garantir"** — descartado explicitamente pela spec (§3.6);
  minimização é requisito, não otimização.
- **Uma env só, sem separar server/client** — descartado: risco real de vazar secret
  pro bundle do client por engano; a separação física em dois arquivos com
  `server-only` torna o erro impossível de passar despercebido (quebra o build).

## Consequences

- Toda feature nova que queira coletar um campo novo precisa justificar contra essa
  lista antes de implementar — não é decisão ad-hoc por módulo.
- T6 (Production Hardening) implementou rate limiting (`nerlev.rate_limits` +
  `rate_limit_hit`, chamado só pelo client service-role — sem GRANT nenhum pro `anon`)
  em `startQuizSession`, `submitQuizOpenFeedback`, `captureQuizLead` e no redirect
  `/r/[book]/amazon`, e honeypot no `LeadCaptureForm`. HTTPS é responsabilidade do
  hosting (Netlify), não do código.
- `/privacidade` (T6) documenta essas decisões pro usuário final — inclusive a lacuna
  conhecida e não corrigida do PostHog disparando sem gate de consentimento (decisão
  consciente do usuário, não esquecimento).

## Status

Accepted — RLS/consent/rate limiting/honeypot implementados (T2-T6). Cookie-consent
banner pro PostHog e monitoring externo (Sentry) ficam como gaps conhecidos, não
implementados por decisão do usuário nesta fase.
