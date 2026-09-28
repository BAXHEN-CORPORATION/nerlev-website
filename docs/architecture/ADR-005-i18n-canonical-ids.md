# ADR-005 — i18n com IDs canônicos independentes de idioma

## Context

O site atende PT/EN/ES com o mesmo significado por trás de temas, livros e perguntas —
texto traduzido nunca pode ser a chave de identidade (spec §3.2-3.3, §20).

## Decision

- **next-intl** pra roteamento (`/pt /en /es`, `localePrefix: 'always'`) e mensagens.
- IDs canônicos em inglês/snake-ish, nunca o texto traduzido (`theme_id = fear`,
  `B01_when-i-am-afraid_davi`) — a implementar junto dos módulos que os usam (T1+).
- Arquivos: `src/lib/i18n/{routing,request}.ts`, mensagens em
  `src/lib/i18n/messages/{pt,en,es}.json`, namespaces `navigation`/`home`/`quiz`/
  `results`/`forms`. **Desvio da spec §20.3 literal** (que mostrava `messages/` na raiz)
  — alinhado com a convenção do projeto irmão `websites-baxhen`.
- `proxy.ts` (não `middleware.ts`, renomeado no Next 16) reexporta o middleware do
  next-intl sem lógica própria.
- `scripts/check-translations.ts` — compara chaves entre os 3 JSONs por namespace,
  falha se houver mismatch (coberto por teste unitário e rodável standalone).

## Alternatives

- **next-international / i18n manual** — descartado, next-intl já cobre roteamento +
  mensagens + tipos, e a compat com `proxy.ts` foi confirmada por inspeção direta do
  tipo de `createMiddleware` (função pura `(request) => NextResponse`, sem assumir nome
  de arquivo).
- **Mensagens na raiz (`messages/`)** — descartado a favor de `src/lib/i18n/messages/`
  pra consistência com o projeto irmão.

## Consequences

- Todo conteúdo futuro (temas, livros, perguntas) precisa nascer com ID canônico antes
  de qualquer tradução — motor de conteúdo tem que respeitar isso desde o primeiro
  módulo que o usa (catalog, T1).
- Verificação de traduções entra no fluxo de `pnpm verify`/`pnpm test`.

## Status

Accepted — roteamento, mensagens vazias e proxy validados end-to-end
(`pnpm build` + `pnpm test:e2e`, redirect e rotas /pt /en /es funcionando).
