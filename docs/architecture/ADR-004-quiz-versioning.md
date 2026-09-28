# ADR-004 — Versionamento do quiz em Git

## Context

O questionário (perguntas, opções, scoring, temas) precisa de histórico auditável e
resultados reproduzíveis ao longo do tempo — pais recebem recomendações baseadas em
scoring que não pode mudar silenciosamente sob uma sessão já registrada (spec §9-11).

## Decision

Perguntas, opções, scoring e temas versionados como código em
`modules/quiz/definitions/v{N}/{questions,options,scoring,themes}.ts` — não em CMS.
Scoring implementado via Strategy Pattern (`ScoringStrategy` com `version` +
`calculate(answers)`), cada sessão grava `quiz_version` e `scoring_version` usados.

Implementado em T2: `src/modules/quiz/definitions/v1/{questions,options,scoring,themes}.ts`,
`ScoringV1` (`src/modules/quiz/definitions/v1/scoring.ts`) implementando `ScoringStrategy`.
Conteúdo do V1 (opções de resposta + pesos de pontuação) foi desenhado durante a
implementação — spec só dava os prompts das perguntas e um exemplo ilustrativo de
scoring, não a matriz completa. Documentado como primeira iteração real, não placeholder.

## Alternatives

- **CMS pro quiz** — descartado, spec explícita (§11, §31): risco de alteração silenciosa
  sem histórico, dificulta comparabilidade entre sessões.
- **Scoring direto no banco (stored procedures)** — descartado: dificulta testar em
  isolamento e versionar ao lado do código que o usa.

## Consequences

- Toda mudança de scoring é uma nova versão (`ScoringV2`, `ScoringV3`, ...), nunca edição
  in-place — protege resultados já mostrados a pais.
- Exige disciplina de nunca editar uma versão já publicada, só criar a próxima.

## Status

Accepted — implementado e validado (unit tests de `ScoringV1` + e2e do fluxo completo).
