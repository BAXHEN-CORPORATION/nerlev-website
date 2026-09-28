# ADR-008 — Modelo de attribution (UTMs + CUT_ID)

## Context

O negócio precisa medir qual conteúdo/vídeo/canal traz tráfego qualificado até o quiz e
até a Amazon (spec §25-26, visão de longo prazo §66). Sem isso, não dá pra decidir onde
investir em produção de conteúdo.

## Decision

Todo conteúdo publicado recebe um `CUT_ID` (ex: `CUT000142`). URLs de campanha carregam
UTMs padrão (`utm_source`, `utm_medium`, `utm_campaign`, `utm_content=<CUT_ID>`),
capturadas e persistidas em `quiz_sessions` no momento da sessão. Clique na Amazon passa
por redirect próprio (`/r/{book}/amazon`) registrado no banco antes do 302, permitindo
medir intenção comercial sem depender só de analytics externo (§24).

Não implementado no T0 — é trabalho de T5 (Attribution). Este ADR fixa o modelo antes da
implementação.

## Alternatives

- **Só analytics de terceiro (PostHog/GA) sem persistir UTM no banco** — descartado:
  perde a correlação direta entre sessão de quiz e origem do tráfego, que é o dado que
  alimenta a decisão editorial (§55, §65-66).
- **Redirect direto pra Amazon sem passar pelo servidor** — descartado: perde o sinal de
  intenção comercial (clique registrado) descrito em §24.

## Consequences

- Toda peça de conteúdo (vídeo, corte, post) precisa nascer com `CUT_ID` antes de ser
  publicada, ou a atribuição quebra na ponta.
- O redirect da Amazon vira uma rota real do app (não um link estático), com custo de
  manutenção (precisa estar sempre no ar pra não quebrar CTAs já publicados).

## Status

Proposed — decisão fixada, implementação entra em T5.
