# ADR-002 — Next.js 16 App Router + hosting no Netlify

## Context

Precisa de SSR/SSG, i18n por rota, e um caminho rápido de MVP a produto. A spec original
(site-definitions-now-future.md §16) especifica Vercel como hosting — decisão revista pelo
usuário durante o T0.

## Decision

Next.js 16 (App Router), TypeScript strict, Tailwind v4 CSS-first, Turbopack (default do
Next 16, sem flags extras). Hosting: **Netlify**, não Vercel — desvio consciente da spec
original. Deploy manual por enquanto (sem GitHub Actions nem automação de deploy no T0);
`netlify.toml` mínimo já versionado (`pnpm build` → `.next`).

Next 16 trouxe breaking changes relevantes que moldaram a implementação:
`middleware.ts` → `proxy.ts` (função exportada `proxy`, runtime Node.js obrigatório),
`params`/`searchParams` sempre `Promise`, `next lint` removido (ESLint via CLI direto).

## Alternatives

- **Vercel** (spec original) — descartado por decisão explícita do usuário; sem automação
  de deploy no CI por ora, revisar quando o deploy manual for configurado.
- **Remix/outro framework** — descartado: Next App Router já cobre i18n por rota,
  SSR/SSG e Server Actions nativamente, sem necessidade de reavaliar.

## Consequences

- `AGENTS.md` do próprio Next 16 manda ler `node_modules/next/dist/docs/` antes de
  código novo — convenções mudam rápido entre versões major.
- Sem deploy automatizado no T0: risco de drift entre o que passa localmente
  (`pnpm verify` + `pnpm build` + `pnpm test:e2e`) e o que realmente vai pro Netlify até
  a automação existir.

## Status

Accepted — app builda e roda (`pnpm build`, `pnpm dev`) validado no T0.
