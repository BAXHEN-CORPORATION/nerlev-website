# NerLev — Implementation & Architecture Reference

Written for: engineers joining or auditing this codebase. This is a map of what exists
today (T0-T6, the full MVP per `site-definitions-now-future.md` PARTE I), not a
tutorial. For *why* a decision was made, see the numbered ADRs in this same folder —
this document says *what* and *where*, they say *why*.

## 1. What this is

"Meu Coração Diante de Deus" — a Christian children's book collection about emotions
(parent brand **NerLev**, concept "Light + Heart", Psalm 119:105/119:11). The site is:

- a marketing site for the book collection (`/`, `/livros`, `/livros/[slug]`);
- an anonymous quiz that recommends a theme/book to parents (`/descobrir` →
  `/resultado/[session]`);
- a research + lead-capture instrument built on top of that quiz.

Three locales: `pt` (default), `en`, `es`. One real book today: B01 ("Quando tenho
medo" / "When I'm Afraid" / "Cuando tengo miedo"), theme `fear`.

## 2. Tech stack

| Concern | Choice | Notes |
|---|---|---|
| Framework | Next.js 16.3.6, App Router, Turbopack | **Not the Next.js in most training data** — `proxy.ts` replaces `middleware.ts`, params/searchParams are async everywhere, `PageProps<'/route'>` type helpers need `next typegen` after route changes. See `AGENTS.md`. |
| Language | TypeScript, strict | |
| Styling | Tailwind CSS v4 | Brand tokens as CSS custom properties in `src/app/globals.css`, no `tailwind.config` (v4 CSS-first). |
| i18n | `next-intl` v4 | `src/lib/i18n/` |
| Database | Supabase (Postgres) | **Shared project** with another app — dedicated `nerlev` schema, never `public.*`. See ADR-003. |
| Validation | Zod v4 | Every Server Action input. |
| Email | Resend | Transactional quiz-result email. |
| Analytics | PostHog (`posthog-js`) | Client-side only, EU region. |
| Testing | Vitest (unit), Playwright (e2e) | `tests/{unit,e2e}/`, not colocated. |
| Hosting | Netlify | `netlify.toml`; no GitHub Actions, no Vercel. |
| Package manager | pnpm 10 | |

No ORM (supabase-js + generated types + repositories), no CMS (content lives in git/TS),
no Redis (rate limiting is Postgres-backed). All deliberate — see §31/§32/§43 of the
spec and ADR-001.

## 3. Architecture: modular monolith

```
src/modules/<name>/
├── domain/          pure types + business rules. No imports from application/infra/ui.
├── application/     use-cases + interfaces (ports) that infra implements.
├── infrastructure/  concrete implementations (Supabase repos, Resend sender, ...).
├── ui/               React components for this module.
└── actions.ts        composition root (see below) — at the module ROOT, not inside application/.
```

Dependency rule: `ui → application → domain`. `infrastructure` implements interfaces
defined in `domain`/`application`. Nothing in `domain` or `application` ever imports
from `infrastructure`.

**Composition root pattern (`actions.ts`)**: Next.js Server Actions need both the
use-case (`application`) and a concrete implementation (`infrastructure`) at the same
call site. Rather than let `application` import `infrastructure` (breaking the rule
above), each module has one `actions.ts` file at its root — the only place allowed to
import both layers, wire them together, and expose the result as a `'use server'`
function (or a plain async function, if the caller is already server-only, e.g. a Route
Handler — see `attribution/actions.ts`). Every module follows this: `quiz/actions.ts`,
`feedback/actions.ts`, `leads/actions.ts`, `attribution/actions.ts`.

Modules today: `catalog`, `quiz`, `feedback`, `leads`, `attribution`, `analytics`.
`analytics` is the exception — it's just `ui/PostHogProvider.tsx`; PostHog is a
third-party client-side SDK, there's no repository/use-case to speak of, so
`domain/application/infrastructure` are empty barrel scaffolding only.

`src/shared/` holds cross-module code with no business identity of its own:
`domain/` (e.g. `ThemeId`, `LocalizedText`), `infrastructure/env/` (env validation),
`infrastructure/supabase/client.ts` (client factories), `attribution/` (UTM parsing),
`rate-limit/`, `seo/`.

## 4. Directory map

```
src/
├── app/
│   ├── [locale]/
│   │   ├── layout.tsx              root layout (html/body), fonts, footer, PostHogProvider
│   │   ├── page.tsx                Home
│   │   ├── opengraph-image.tsx     OG image, generated per locale (next/og)
│   │   ├── livros/page.tsx         book collection list
│   │   ├── livros/[slug]/page.tsx  book detail + Schema.org Book JSON-LD
│   │   ├── descobrir/page.tsx      quiz entry — reads UTMs/referer, renders <QuizFlow>
│   │   ├── resultado/[session]/page.tsx   quiz result, noindex
│   │   └── privacidade/page.tsx    privacy page
│   ├── r/[book]/amazon/route.ts    Amazon redirect (outside [locale] — not content)
│   ├── sitemap.ts, robots.ts       SEO file conventions
│   ├── icon.png, apple-icon.png    favicon (Next.js file convention)
│   └── globals.css                 Tailwind v4 + brand color tokens
├── modules/<name>/…                see §3
├── shared/…                        see §3
├── lib/i18n/                       routing.ts, request.ts, messages/{pt,en,es}.json
└── proxy.ts                        next-intl middleware (locale negotiation/prefixing)
```

## 5. Routing & i18n

`next-intl` with `localePrefix: 'always'` — every route is `/{locale}/...`, no
unprefixed default. `src/proxy.ts` wraps `next-intl`'s `createMiddleware` and exports it
as `proxy` (not `middleware` — Next 16 convention). Matcher excludes `/r/*` (the Amazon
redirect is deliberately outside locale routing) and static files.

`isValidLocale()` (`src/lib/i18n/routing.ts`) guards every page against invalid locale
segments (`notFound()`).

Build output (static vs dynamic), current as of T6:

| Route | Type | Why |
|---|---|---|
| `/[locale]`, `/[locale]/livros`, `/[locale]/livros/[slug]` | Static (SSG) | `generateStaticParams` per locale/book. |
| `/[locale]/privacidade` | Static (SSG) | |
| `/[locale]/descobrir` | Dynamic | Reads `searchParams`/`headers()` for UTM attribution (T5). |
| `/[locale]/resultado/[session]` | Dynamic | Per-session data, `noindex`. |
| `/[locale]/opengraph-image` | Dynamic | Per-locale `ImageResponse` generation. |
| `/r/[book]/amazon` | Dynamic | Rate-limited redirect, logs click. |
| `/sitemap.xml`, `/robots.txt` | Static | |

## 6. Modules in detail

### 6.1 `catalog` — books

Pure in-code catalog (no DB table — content-in-git, ADR-007): `domain/books.ts` is the
single source of truth for `Book` records (id/code/slug/canonicalTheme/title/subtitle/
author/cover/amazonUrl, each title/subtitle localized). `application/{list-books,
get-book}.ts` read from it. No `infrastructure/` needed (nothing external to reach).
`ui/{BookCard,BookCover}.tsx`.

### 6.2 `quiz` — the quiz engine

- `domain/`: `Question`, `QuizAnswer`, `Theme`, `ScoringStrategy` (interface: `version`
  + `calculate(answers): QuizScore` — Strategy Pattern, ADR-004, so `ScoringV2` etc. can
  be added later without touching callers).
- `definitions/v1/`: the actual **content** — `questions.ts` (7 structured questions,
  spec §8.2), `options.ts` (answer options + per-theme scoring weights), `themes.ts` (12
  themes: fear, anger, sadness, longing, jealousy, patience, desire, guilt, truth,
  conflict, forgiveness, loneliness — each with label/description/tips per locale),
  `scoring.ts` (`ScoringV1`, deterministic sum-and-rank). This content was designed by
  the implementer, not copied from the spec — the spec only gave prompts + one
  illustrative example, not full option/scoring content. Documented as a first real
  iteration, not a placeholder.
- `application/`: `start-session`, `submit-answer`, `complete-session`,
  `get-session-result`, plus the `QuizSessionRepository` port.
- `infrastructure/quiz-session.repository.ts`: Supabase implementation.
- `ui/`: `QuizFlow.tsx` (the `useReducer` state machine, spec §30 — see `quiz-state.ts`
  for the exact state graph: `idle → starting → question ⇄ saving → openQuestions →
  completing → result`, with an `error` state reachable from anywhere), `QuestionScreen.tsx`.
- `actions.ts`: `startQuizSession` (rate-limited, T6), `submitQuizAnswer`,
  `completeQuizSession`, `getQuizResult`.

Session identity is anonymous (ADR-006) — an unguessable UUID is the only "auth". RLS on
`quiz_sessions`/`quiz_answers`/`quiz_theme_scores` is therefore permissive by role
(`anon`), not by row owner; the real protection is data minimization (no PII collected)
plus the UUID being unguessable. Documented, deliberate limitation.

### 6.3 `feedback` — research layer (T3)

Two optional open-text questions after the 7 structured ones (spec §8.3, exact wording).
`domain/{open-feedback,consent}.ts`, `application/submit-open-feedback.ts`,
`infrastructure/feedback.repository.ts`, `ui/OpenQuestionsScreen.tsx`.

**Consent gate, exactly as strict as it sounds**: if the user doesn't check the research
consent checkbox, `submitOpenFeedbackUseCase` writes *nothing* — not the text, not a
"declined" consent row. Minimization applied to the write decision itself, not just to
which fields exist. `submitQuizOpenFeedback` (`actions.ts`) is rate-limited (T6) but its
caller (`OpenQuestionsScreen.handleContinue`) calls `onDone()` in a `finally` block —
feedback submission failing (rate limit, network, anything) never blocks the quiz from
completing.

### 6.4 `leads` — lead engine (T4)

Email capture on the result page, non-blocking (spec §14 — never gates seeing the
result). `domain/lead.ts`, `application/{capture-lead, email-sender, lead-repository}.ts`
(ports), `infrastructure/{resend-email-sender, lead.repository}.ts` (Supabase +
Resend), `infrastructure/emails/QuizResultEmail.tsx` (hand-written HTML/table email —
`@react-email/components` is fully deprecated upstream, confirmed via `npm view`, so
this renders through `resend`'s own transitive `@react-email/render` dependency
instead), `ui/LeadCaptureForm.tsx`.

Two consents live side by side here: `marketingConsent` (this module, optional, never
blocks receiving the result email) and the research consent from `feedback` (separate
purpose, separate row in `consent_records`). `captureLead`: email delivery is
best-effort — failure is logged and swallowed, the lead row is saved regardless.

Waitlist (spec §13) isn't a separate table — it's just a lead attached to a session
whose theme has no book yet in the catalog. Same form, same code path.

`actions.ts` (`captureQuizLead`): rate-limited (5/hour/IP, T6) and honeypot-gated (a
hidden `website` field — non-empty means bot, returns a fake success without writing
anything).

### 6.5 `attribution` (T5)

- `shared/attribution/parse-attribution.ts`: pure function, `searchParams` + `referrer`
  → `{ utmSource, utmMedium, utmCampaign, utmContent, referrer }`. Called from
  `/[locale]/descobrir/page.tsx`, passed into `<QuizFlow>`, forwarded to
  `startQuizSession`. (This closed a real gap: `quiz_sessions.utm_*` columns existed
  since T2 but were never actually populated until T5, because `/descobrir` never read
  `searchParams` before.)
- `domain/amazon-click.ts`, `application/log-amazon-click.ts`,
  `infrastructure/amazon-click.repository.ts`: click tracking for the Amazon redirect.
- `actions.ts` → `logAmazonClickBestEffort`, called by `src/app/r/[book]/amazon/route.ts`
  before the 302. Best-effort: a broken FK (unknown session) or any other insert failure
  is logged and swallowed, the redirect always happens.

### 6.6 `analytics` (T5) — PostHog

`ui/PostHogProvider.tsx` only. Two things worth knowing:

1. **Split into an isolated inner component.** `useSearchParams()` requires a
   `Suspense` boundary and forces its whole subtree to dynamic rendering. If the
   pageview-tracking logic lived directly in `PostHogProvider` (which wraps `children`),
   it would have dragged the entire app — including the statically-generated Home and
   `/livros` — into dynamic rendering. Instead, `PostHogPageView` is a sibling that
   returns `null`, wrapped in its own `<Suspense>`, with `children` rendered outside
   that boundary.
2. **No-op without a key.** `publicEnv.NEXT_PUBLIC_POSTHOG_KEY` is optional; every
   function checks it and returns early if absent, so the app never breaks in an
   environment without PostHog configured.
3. **Known, deliberate gap**: PostHog fires `$pageview` on every route with no
   cookie-consent gate. Not implemented — a conscious choice, documented on
   `/privacidade`, not an oversight.

## 7. Database (Supabase, schema `nerlev`)

The Supabase project is **shared with another app**. Everything below lives in the
`nerlev` schema; `public.*` belongs to the other app and is never touched. Migrations
are applied with `supabase db push --db-url <SUPABASE_DB_URL>` — **never** `db pull`
(would risk dumping the other app's schema).

### Tables

| Table | Purpose | Key FKs |
|---|---|---|
| `quiz_sessions` | one row per quiz attempt (anonymous) | — |
| `quiz_answers` | one row per answered question | → `quiz_sessions` |
| `quiz_theme_scores` | per-theme score + rank for a session | → `quiz_sessions` |
| `open_feedback` | the 2 optional open-text answers | → `quiz_sessions` |
| `consent_records` | one row per (purpose, session/lead) consent grant | → `quiz_sessions`, → `leads` (nullable) |
| `leads` | email + locale, unique on email | — |
| `lead_quiz_sessions` | junction: which sessions a lead is tied to | → `leads`, → `quiz_sessions` |
| `amazon_clicks` | click log for `/r/[book]/amazon` | → `quiz_sessions` (nullable — Home/livros clicks have no session) |
| `rate_limits` | bookkeeping only, T6 | — |

### Views (spec §41 — manual analysis via Supabase Studio, no admin dashboard)

`v_quiz_funnel`, `v_theme_demand`, `v_theme_by_age`, `v_theme_by_locale`,
`v_open_feedback` (filters `where research_consent = true` — consent respected on read,
not just on write), `v_attribution_by_content`.

### Function

`rate_limit_hit(p_key text, p_limit int, p_window_seconds int) returns boolean` — atomic
upsert-based check-and-increment for rate limiting (T6). Called only by the service-role
client.

### The RLS/GRANT lesson (learned three separate times — read this before adding a table)

**RLS policies alone grant nothing.** Postgres requires a base **table-level GRANT**
before a policy is even evaluated. Every table above except `rate_limits` grants
`select, insert[, update]` to `anon` *and* has permissive RLS policies (`using (true)`)
— permissive by role, not by row owner, because there's no `auth.uid()` in an anonymous
flow (ADR-006).

`rate_limits` is the exception, on purpose: only the **service-role** client touches it
(never `anon`), so it gets zero grants/policies for `anon` at all. But that surfaced a
second, subtler version of the same lesson: **`service_role` bypasses RLS policies, but
still needs its own explicit table GRANT** — RLS-bypass and table-level privilege are
orthogonal mechanisms in Postgres. First attempt failed with `permission denied for
table rate_limits` even from `service_role`; fixed in a follow-up migration
(`rate_limits_grants.sql`).

One more Supabase-specific gotcha: `supabase/config.toml`'s `[api].schemas` only
controls the **local** dev stack. The **remote hosted** project needs the `nerlev`
schema added manually via Dashboard → Settings → Data API → Exposed schemas, or the API
can't see it at all regardless of what migrations say.

## 8. Rate limiting & anti-abuse (T6, spec §29)

Deliberately **not Redis** (spec §43 discourages it as an MVP dependency) — a Postgres
table plus the atomic RPC above. `src/shared/rate-limit/`:

- `get-client-ip.ts`: prefers Netlify's `x-nf-client-connection-ip` (set by the
  platform from the real connection, not spoofable) over `x-forwarded-for` (client-set,
  spoofable), falls back to `'unknown'`.
- `check-rate-limit.ts`: `assertWithinRateLimit(action, { limit, windowSeconds })`,
  bucket key `${action}:${ip}`. **Fails open on any infra error** — a broken RPC call or
  even a client-creation failure (e.g. missing service-role key) is caught, logged, and
  treated as "allowed." An outage in this bookkeeping table must never block a real
  user action — same principle as the best-effort email/click-logging elsewhere.

Applied to: `startQuizSession` (20/10min/IP), `submitQuizOpenFeedback` (10/10min/IP),
`captureQuizLead` (5/hour/IP — the one that sends a real email via Resend, highest
cost/reputation risk if abused), and `GET /r/[book]/amazon` (60/5min/IP, generous on
purpose — legitimate ad traffic can click repeatedly; returns 429 instead of redirecting
past the limit).

Honeypot: a hidden `website` field on `LeadCaptureForm`, off-screen and out of tab
order. Non-empty on submit ⇒ fake success, nothing written, no signal given back to
whatever filled it in.

## 9. SEO (T6, spec §36)

- `src/shared/seo/{site-url,alternates}.ts`: `absoluteUrl(locale, path)`, `assetUrl(path)`
  (no locale prefix — for public/ assets like book covers), `buildAlternates(locale,
  path)` → `{ canonical, languages }` built from `routing.locales`. Everything derives
  from `NEXT_PUBLIC_SITE_URL` — no domain hardcoded anywhere, so going live is an env
  var change, not a code change.
- `src/app/sitemap.ts` / `robots.ts`: native Next.js file conventions, no extra
  dependency. Sitemap covers Home/`/livros`/`/livros/[slug]` × 3 locales with per-entry
  hreflang; `/resultado/*` is excluded (dynamic per session, already `noindex`).
  `robots.ts` disallows `/resultado`, points at the sitemap.
- `generateMetadata` on Home/`/livros`/`/livros/[slug]`/`/descobrir` sets
  `alternates` (canonical + hreflang) and `openGraph`.
- `src/app/[locale]/opengraph-image.tsx`: `ImageResponse` (native `next/og`, no extra
  dependency), one image per locale, brand colors + icon + localized tagline.
- `/livros/[slug]`: Schema.org `Book` JSON-LD, built only from real `Book` domain
  fields (no invented `isbn`/rating/etc.).
- `/resultado/[session]`: `robots: { index: false, follow: false }` (unchanged since
  T2 — correct from the start).

## 10. Accessibility (T6)

Real, targeted fixes rather than a full audit: question/feedback titles are `<h2>`
(were `<p>`), the current-question container has `aria-live="polite"` (question changes
are a client-side state transition, not a page navigation — nothing announced it to
screen readers before), and error messages across the quiz/lead flows use `role="alert"`.
Existing label/input associations (checkboxes wrapped in `<label>`, `htmlFor`/`id` on
textareas) were already correct and left alone.

## 11. Testing

`tests/unit/` (Vitest): quiz scoring determinism across locales (highest priority per
spec §37 — same answers must produce the same result in PT/EN/ES), `parse-attribution`,
`capture-lead` (proves email failure never blocks the lead write), translation-key
parity across the 3 message files.

`tests/e2e/` (Playwright, `chromium` only, `workers: 2` locally / `1` in CI — capped
deliberately, higher parallelism caused transient `fetch failed` against the shared
Supabase project under load, not an app bug):

- `home.spec.ts`, `catalog.spec.ts`: page-load-level checks across all 3 locales.
- `quiz.spec.ts`, `feedback.spec.ts`, `leads.spec.ts`, `attribution.spec.ts`: specific
  flows and edge cases (unknown session, consent decline, invalid FK on click logging),
  PT-only — these test variations of the flow, not the flow itself in every language.
- `full-flow.spec.ts` (T6): the actual spec §37 requirement — the full diagram
  (Home→Quiz→Perguntas→Feedback→Resultado→Email→Amazon) exercised end-to-end in **all
  three locales**, with a small localized-label lookup table.

`pnpm verify` = typecheck + lint + unit tests. `pnpm build` + `pnpm test:e2e` run
separately (e2e needs a built, running app).

## 12. External services & environment

Two-file env split (`src/shared/infrastructure/env/`), both Zod-validated:

- `env.client.ts` — `NEXT_PUBLIC_*` only, importable from Client Components.
- `env.server.ts` — everything else, guarded by `import 'server-only'` (build fails if
  a Client Component imports it).

| Var | Used by | Notes |
|---|---|---|
| `NEXT_PUBLIC_SITE_URL` | SEO helpers, absolute links in emails | Defaults to `localhost:3000`; swap for the real domain when it exists, no code change needed. |
| `NEXT_PUBLIC_SUPABASE_URL` / `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `createServerSupabaseClient()` | anon-key client, RLS-governed, used by almost every repository. |
| `SUPABASE_SERVICE_ROLE_KEY` | `createServiceRoleSupabaseClient()` | **Only consumer today is rate limiting.** Bypasses RLS but still needs table GRANTs (§7). Missing ⇒ rate limiting fails open silently — check this env var first if rate limiting seems to do nothing. |
| `SUPABASE_DB_URL` | `supabase db push` (CLI, not the app) | Points at the pooler; project ref `vlresnvhwsplqlgsqrnp`, region `eu-west-1`. |
| `RESEND_API_KEY` | `resend-email-sender.ts` | Sandbox sender (`onboarding@resend.dev`) until a domain is verified — expect delivered mail to land in spam until then. |
| `NEXT_PUBLIC_POSTHOG_KEY` / `_HOST` | `PostHogProvider.tsx` | Key **must** start with `phc_` (public Project API Key) — a `phs_` key (a different PostHog credential type) looks like it works but silently drops every event; this exact mix-up happened once during setup. Host: `eu.i.posthog.com`. |

`.env.local` is gitignored; `.env.local.example` documents every var without values.

## 13. Deployment

Netlify (`netlify.toml`: `pnpm build`, publish `.next`), not Vercel, no GitHub Actions.
Environments: local (Next dev + Supabase remote — no local Supabase stack in practice),
Netlify deploy previews, production. No CI pipeline wired yet beyond what a contributor
runs locally (`pnpm verify`, `pnpm build`, `pnpm test:e2e`).

## 14. Deliberately out of scope (not forgotten — decided)

Per spec §43 and explicit choices made during T6:

- **Sentry / external error monitoring** — user chose to skip for now. Today's only
  "monitoring" is `console.error` at the handful of best-effort failure points (email
  send, click logging, rate-limit RPC failure) plus whatever Netlify's own function
  logs capture.
- **Cookie-consent banner for PostHog** — user chose not to gate analytics behind
  consent. Stated plainly on `/privacidade` rather than hidden.
- **Legal review of `/privacidade`** — content is accurate to what the code actually
  does (same source of truth as ADR-009), written by the team, explicitly marked as a
  "v1 draft" with no formal legal review yet.
- Auth/parent accounts, CMS, ecommerce, mobile app, ML recommendations, gamification,
  subscriptions — all explicitly excluded from the MVP (spec §43), nothing here works
  around that.

## 15. Where to look next

- `docs/architecture/ADR-00{1-9}-*.md` — the *why* behind modular monolith, Next.js,
  Supabase, quiz versioning, i18n IDs, anonymous sessions, content-in-git, attribution
  model, data privacy.
- `site-definitions-now-future.md` — the full spec (PARTE I = this MVP, PARTE II =
  future vision, not built).
- `nerlev-visual-identity-spec.md` — brand palette, typography, logo usage.
- `AGENTS.md` — Next.js 16 breaking-changes notes; read before assuming any
  App Router API matches older training data.
