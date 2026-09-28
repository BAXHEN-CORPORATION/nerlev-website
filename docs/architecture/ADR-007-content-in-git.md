# ADR-007 — Conteúdo editorial em Git + MDX, sem CMS

## Context

Conteúdo de livros/temas precisa de revisão editorial e versionamento junto do código, e
o volume inicial (1 livro, poucos temas) não justifica a complexidade de um CMS
(spec §20.4, §31).

## Decision

Conteúdo longo (descrição de livros, texto editorial) em MDX sob
`src/content/{books,themes}/`, versionado em Git ao lado do código. Convenção:
`content/books/{code}/{locale}.mdx` (ex: `content/books/B01/pt.mdx`). Sem CMS no MVP —
reavaliar (Sanity/Payload/Contentful) só quando a equipe editorial crescer ou publicação
ficar frequente o bastante pra justificar interface administrativa (§71).

## Alternatives

- **Headless CMS desde já** — descartado, overhead de integração/hosting sem
  necessidade real ainda; a fonte canônica do quiz continuaria separada de qualquer
  forma (§71).
- **Conteúdo hardcoded em componentes React** — descartado: mistura conteúdo editorial
  com código de UI, dificulta revisão por quem não é dev.

## Consequences

- Toda edição de conteúdo passa por PR/git — sem interface pra não-técnicos ainda.
- Fácil migrar pra CMS depois: MDX exportável, estrutura de pastas já espelha o que um
  CMS chamaria de "coleção".

## Status

Accepted — convenção documentada (`src/content/*/README.md`), população real entra em T1.
