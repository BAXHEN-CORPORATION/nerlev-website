# Especificação do Site — Meu Coração Diante de Deus

## 1. Objetivo do documento

Este documento consolida as definições técnicas e funcionais do site da coleção **Meu Coração Diante de Deus**, separando claramente:

- **AGORA / MVP**: o que será construído inicialmente para lançar rápido, validar aquisição, captar leads e coletar sinais editoriais.
- **FUTURO**: evoluções planejadas que devem ser consideradas na arquitetura desde o início, mas não precisam ser implementadas agora.

O objetivo é evitar overengineering sem criar dívida arquitetural que dificulte a expansão futura.

---

# 2. Visão do produto

O site não será apenas uma vitrine dos livros.

Ele deve funcionar como uma plataforma para:

1. apresentar a coleção;
2. direcionar o usuário para compra dos livros na Amazon;
3. captar leads;
4. aplicar um questionário orientativo para pais;
5. identificar os temas que os pais mais desejam trabalhar com seus filhos;
6. coletar relatos abertos sobre situações reais;
7. usar esses dados para orientar os próximos livros;
8. medir quais conteúdos, vídeos e canais trazem tráfego qualificado;
9. futuramente coletar feedback pós-leitura;
10. construir uma jornada de leitura e desenvolvimento familiar ao longo da coleção.

---

# 3. Princípios do projeto

## 3.1 Temas universais por padrão

Os temas devem ser tratados como universais:

- medo;
- raiva;
- tristeza;
- saudade;
- ciúme;
- paciência;
- desejo;
- culpa;
- verdade;
- conflito;
- perdão;
- solidão.

Adaptações regionais ou culturais só devem ser feitas quando houver evidência explícita de necessidade.

## 3.2 Idioma, região e significado são conceitos diferentes

Exemplo:

```txt
Idioma: português
Região de compra: Portugal
Contexto cultural: brasileiro
```

Esses conceitos não devem ser misturados.

## 3.3 Identidade canônica independente do idioma

Exemplo:

```txt
PT: Medo
ES: Miedo
EN: Fear

ID canônico: fear
```

O mesmo princípio vale para livros:

```txt
PT: Quando tenho medo — Uma história de Davi
ES: Cuando tengo miedo — Una historia de David
EN: When I'm Afraid — A Story of David

ID canônico: B01_when-i-am-afraid_davi
```

## 3.4 O questionário é dirigido aos pais

O site não deve apresentar o questionário como teste infantil ou diagnóstico psicológico.

A comunicação deve ser voltada aos pais:

> Descubra quais temas podem ser mais importantes para trabalhar com seu filho neste momento.

## 3.5 O questionário não é diagnóstico

Evitar linguagem como:

- “Seu filho tem ansiedade”;
- “Seu filho apresenta transtorno”;
- “Seu filho possui problema emocional”.

Preferir:

- “Uma área que pode valer a pena trabalhar juntos”;
- “Esse tema apareceu com maior frequência nas suas respostas”;
- “Pode ser útil conversar sobre coragem diante do medo”.

## 3.6 Minimização de dados

Não coletar sem necessidade:

- nome da criança;
- data de nascimento;
- escola;
- endereço;
- telefone;
- fotografia;
- sobrenome;
- identificadores desnecessários.

Coletar apenas o necessário para recomendação e pesquisa editorial.

---

# PARTE I — AGORA / MVP

# 4. Objetivo do MVP

O MVP deve validar esta hipótese:

> Conteúdos sobre criação de filhos, psicologia infantil e formação cristã conseguem gerar pais interessados, que completam um questionário, deixam informações úteis sobre suas necessidades e demonstram interesse nos livros.

---

# 5. Fluxo principal do MVP

```txt
Reels / Shorts / TikTok
        ↓
CTA
"Descubra o que seu filho
mais precisa desenvolver"
        ↓
Website
        ↓
Questionário
        ↓
Tema principal + tema secundário
        ↓
Recomendação
        ↓
┌─────────────────┬─────────────────┐
↓                                   ↓
captura de email                  livro
↓                                   ↓
lead segmentado                   Amazon
↓
dados editoriais
```

---

# 6. Páginas do MVP

Estrutura inicial:

```txt
/[locale]
/[locale]/descobrir
/[locale]/resultado/[session]
/[locale]/livros
/[locale]/livros/[slug]
/[locale]/privacidade
```

Idiomas previstos:

```txt
/pt/
/en/
/es/
```

---

# 7. Home

A Home deve ser simples e orientada a conversão.

## Conteúdo mínimo

1. proposta da coleção;
2. CTA principal para o questionário;
3. apresentação do livro disponível;
4. breve explicação da filosofia editorial;
5. CTA de compra na Amazon;
6. indicação de que novos livros estão em desenvolvimento.

## Exemplo de CTA

> Descubra qual tema pode ser mais importante trabalhar com seu filho agora.

---

# 8. Questionário MVP

## 8.1 Estrutura

Inicialmente:

- 7 perguntas estruturadas;
- 2 perguntas abertas opcionais.

## 8.2 Perguntas estruturadas

Devem medir situações observáveis relacionadas a:

- medo;
- raiva;
- frustração;
- ciúme;
- espera;
- conflito;
- culpa;
- honestidade;
- tristeza;
- solidão;
- perdão;
- desejo.

Exemplos:

1. Qual é a idade da criança?
2. Quando alguma coisa assusta seu filho, como ele costuma reagir?
3. Quando ele não consegue algo que queria, como reage?
4. Como reage quando outra criança pega algo dele?
5. Como reage quando percebe que fez algo errado?
6. Como reage quando precisa esperar ou aceitar um “não”?
7. Qual área você gostaria especialmente de ajudá-lo a desenvolver?

## 8.3 Perguntas abertas

### Situação atual

> Existe alguma situação específica que tem sido difícil para vocês recentemente?

Orientação:

> Não inclua nomes, escola, endereço ou informações que possam identificar a criança.

### Objetivo do pai

> Existe algo que você gostaria especialmente de ajudar seu filho a aprender ou desenvolver?

---

# 9. Scoring do questionário

O scoring inicial deve ser:

- determinístico;
- simples;
- auditável;
- versionado;
- independente de idioma;
- independente de React;
- independente do banco.

Exemplo:

```txt
Resposta A
fear +2
patience +1
```

Resultado:

```txt
Primary theme: fear
Secondary theme: patience
```

---

# 10. Strategy Pattern para scoring

Definir uma interface conceitual:

```ts
interface ScoringStrategy {
  version: number

  calculate(
    answers: QuizAnswer[]
  ): QuizScore
}
```

Implementações:

```txt
ScoringV1
ScoringV2
ScoringV3
```

Cada sessão deve guardar:

```txt
quiz_version
scoring_version
```

---

# 11. Definição do quiz em Git

O questionário deve ser versionado em código.

Estrutura:

```txt
modules/quiz/definitions/

v1/
├── questions.ts
├── options.ts
├── scoring.ts
└── themes.ts
```

Não colocar perguntas e scoring em CMS no MVP.

Motivos:

- manter histórico;
- preservar comparabilidade;
- evitar alterações silenciosas;
- permitir testes;
- reproduzir resultados.

---

# 12. Resultado do questionário

O resultado deve mostrar:

1. tema principal;
2. tema secundário;
3. breve explicação;
4. 2–3 orientações práticas;
5. livro recomendado;
6. captura de email;
7. opção de entrar em lista de espera para temas ainda sem livro.

---

# 13. Livro recomendado

Se houver livro disponível para o tema:

```txt
Tema: medo

Livro:
Quando tenho medo — Uma história de Davi

CTA:
Conhecer na Amazon
```

Se ainda não houver livro:

> Estamos preparando uma história sobre este tema.

CTA:

> Quero ser avisado.

---

# 14. Captura de email

O resultado básico não deve ficar bloqueado.

Depois de mostrar o resultado:

> Quer receber este resultado com perguntas para conversar com seu filho?

Campos:

```txt
email
consentimento opcional de marketing
```

Não obrigar o usuário a aceitar newsletter para ver o resultado.

---

# 15. Arquitetura técnica do MVP

## 15.1 Arquitetura geral

```txt
                    INTERNET
                       │
                       ▼
               ┌──────────────┐
               │    Vercel    │
               │   Next.js    │
               └──────┬───────┘
                      │
        ┌─────────────┼─────────────┐
        ▼             ▼             ▼
   Site público    Quiz/API     Redirect Amazon
        │             │             │
        └─────────────┼─────────────┘
                      ▼
              Application Layer
                      │
        ┌─────────────┼─────────────┐
        ▼             ▼             ▼
      Quiz           Leads        Catalog
        │             │             │
        └─────────────┼─────────────┘
                      ▼
                Infrastructure
                      │
        ┌─────────────┼─────────────┐
        ▼             ▼             ▼
    Supabase        Resend        PostHog
```

---

# 16. Stack do MVP

| Camada | Tecnologia |
|---|---|
| Linguagem | TypeScript strict |
| Framework | Next.js 16 App Router |
| UI | React |
| Styling | Tailwind CSS |
| Componentes base | shadcn/ui seletivamente |
| i18n | next-intl |
| Banco | PostgreSQL via Supabase |
| Client DB | supabase-js |
| Migrations | Supabase CLI |
| Validação | Zod |
| Email | Resend |
| Templates de email | React Email |
| Analytics | PostHog |
| Unit tests | Vitest |
| UI tests | Testing Library |
| E2E | Playwright |
| Hosting | Vercel |
| Repo | GitHub |
| CI/CD | GitHub Actions |
| Package manager | pnpm |

---

# 17. Padrão arquitetural

Utilizar:

- Modular Monolith;
- Clean Architecture simplificada;
- DDD-lite;
- separação por domínio;
- Strategy Pattern para scoring;
- Repository Pattern;
- State Machine conceitual no quiz;
- Design Tokens para UI.

Evitar microserviços inicialmente.

---

# 18. Organização do código

```txt
src/
├── app/
│   └── [locale]/
│
├── modules/
│   ├── quiz/
│   ├── catalog/
│   ├── leads/
│   ├── feedback/
│   ├── analytics/
│   └── attribution/
│
├── shared/
│   ├── ui/
│   ├── i18n/
│   ├── validation/
│   └── infrastructure/
│
└── content/
```

---

# 19. Estrutura interna dos módulos

Exemplo:

```txt
modules/quiz/
├── domain/
├── application/
├── infrastructure/
└── ui/
```

Dependências:

```txt
UI
 ↓
Application
 ↓
Domain

Infrastructure
 ↓
interfaces definidas pelo domínio/aplicação
```

---

# 20. Internacionalização

## 20.1 Estrutura de rotas

```txt
/pt/
/en/
/es/
```

## 20.2 IDs canônicos

Nunca usar o texto traduzido como chave.

Exemplo:

```txt
theme_id = fear
```

## 20.3 Traduções

```txt
messages/
├── pt.json
├── en.json
└── es.json
```

Separar namespaces:

```txt
navigation
home
quiz
results
forms
```

## 20.4 Conteúdo longo

Usar MDX para conteúdo editorial:

```txt
content/
├── books/
│   └── B01/
│       ├── pt.mdx
│       ├── en.mdx
│       └── es.mdx
│
└── themes/
```

---

# 21. Adaptação cultural

O comportamento padrão deve ser universal.

Exemplos regionais só quando necessário.

Exemplo:

```txt
question_id:
frustration_stop_activity
```

Pode ter exemplos diferentes por variante cultural, mas o significado e scoring permanecem iguais.

---

# 22. Banco de dados MVP

## 22.1 quiz_sessions

```txt
id
quiz_version
scoring_version
locale
child_age_band

utm_source
utm_medium
utm_campaign
utm_content

referrer
started_at
completed_at

primary_theme_id
secondary_theme_id
```

## 22.2 quiz_answers

```txt
session_id
question_id
answer_id
answered_at
```

## 22.3 quiz_theme_scores

```txt
session_id
theme_id
score
rank
```

## 22.4 open_feedback

```txt
id
session_id
feedback_type
original_text
locale
research_consent
created_at
```

Tipos:

```txt
current_challenge
desired_growth
```

## 22.5 leads

```txt
id
email
locale
created_at
```

## 22.6 lead_quiz_sessions

```txt
lead_id
session_id
```

## 22.7 consent_records

```txt
id
lead_id
session_id
purpose
policy_version
granted_at
withdrawn_at
```

Purposes:

```txt
marketing
editorial_research
```

---

# 23. Catálogo

Separar livro canônico de edição.

## books

```txt
id
code
slug
primary_theme
status
```

## book_editions

```txt
id
book_id
locale
title
status
```

## book_store_links

```txt
book_edition_id
store
region
url
asin
```

---

# 24. Compra na Amazon

O site não terá ecommerce próprio inicialmente.

Usar Amazon como destino.

Preferencialmente:

```txt
/r/B01/amazon
```

Fluxo:

```txt
clique
↓
registro no banco
↓
redirect 302
↓
Amazon
```

Isso permite medir intenção comercial sem depender apenas de analytics externos.

---

# 25. Attribution

Todo conteúdo publicado deve receber um identificador.

Exemplo:

```txt
CUT000142
```

URL:

```txt
/pt/descobrir
?utm_source=youtube
&utm_medium=short
&utm_campaign=fear
&utm_content=CUT000142
```

Guardar UTMs na `quiz_session`.

---

# 26. Métricas principais

Medir:

```txt
landing_view
quiz_started
quiz_answered
quiz_completed
result_viewed
lead_submitted
book_viewed
amazon_clicked
```

KPIs principais:

1. taxa de início do quiz;
2. taxa de conclusão;
3. conversão em lead;
4. clique na Amazon;
5. distribuição dos temas;
6. volume e qualidade do feedback aberto;
7. origem do tráfego;
8. desempenho por CUT_ID.

---

# 27. Analytics

Usar duas camadas.

## Dados críticos

Registrar no próprio PostgreSQL:

- quiz iniciado;
- quiz concluído;
- lead capturado;
- Amazon click.

## Analytics comportamental

Usar PostHog para:

- pageviews;
- funis;
- comportamento;
- UTMs;
- análise de páginas.

---

# 28. Email

Stack:

```txt
Resend
+
React Email
```

Separar:

### Transacional

- resultado do quiz;
- material solicitado.

### Marketing

- novos conteúdos;
- lançamentos;
- listas de espera;
- próximos livros.

Consentimento separado.

---

# 29. Segurança e privacidade

## Não coletar

- nome da criança;
- escola;
- endereço;
- foto;
- nascimento exato;
- telefone.

## Coletar

- faixa/idade;
- respostas;
- texto aberto opcional.

## Proteções

- validação server-side;
- Zod;
- limites de tamanho;
- rate limiting;
- honeypot anti-spam;
- logs sem feedback sensível;
- HTTPS;
- policies de acesso;
- secrets somente server-side.

---

# 30. Estado do quiz

Não usar Redux ou Zustand inicialmente.

Usar:

```txt
useReducer
```

Estados conceituais:

```txt
idle
↓
starting
↓
question
↓
saving
↓
question
↓
completing
↓
result
```

---

# 31. CMS

Não usar CMS no MVP.

Conteúdo editorial:

```txt
Git
+
MDX
+
Next.js
```

Reavaliar CMS quando pessoas não técnicas precisarem editar conteúdo com frequência.

---

# 32. ORM

Não usar ORM inicialmente.

Stack:

```txt
Supabase
+
supabase-js
+
tipos gerados
+
repositories
```

Reavaliar Drizzle/ORM se as queries crescerem em complexidade.

---

# 33. Design System

Estrutura:

```txt
DESIGN TOKENS
↓
PRIMITIVES
↓
PATTERNS
↓
FEATURE COMPONENTS
↓
PAGES
```

Tokens:

```txt
color
spacing
radius
shadow
typography
```

Primitives:

```txt
Button
Card
Heading
Text
Input
Radio
Progress
```

Componentes de domínio:

```txt
BookCard
ThemeCard
QuizOption
QuizProgress
ResultCard
ParentTip
```

---

# 34. Direção visual

O site deve parecer:

- acolhedor;
- editorial;
- familiar;
- ilustrado;
- coerente com os livros;
- voltado a pais.

Evitar:

- aparência SaaS genérica;
- UI infantil voltada diretamente à criança;
- excesso de cores sem hierarquia;
- gamificação precoce.

---

# 35. Imagens

Separar assets de impressão de assets web.

Pipeline:

```txt
MASTER PRINT
↓
web export
↓
AVIF/WebP
↓
responsive images
```

Usar `next/image`.

---

# 36. SEO

Implementar:

- canonical;
- sitemap;
- robots;
- hreflang;
- OpenGraph;
- metadados sociais;
- Schema.org `Book`.

Resultados do quiz:

```txt
noindex
```

---

# 37. Testes

## Unitários

Prioridade máxima para scoring.

Testar:

```txt
mesmas respostas
PT / EN / ES
↓
mesmo resultado
```

## Integração

Fluxo:

```txt
start session
→ answer
→ complete
→ result
```

## E2E

Playwright:

```txt
Home
↓
Quiz
↓
Perguntas
↓
Feedback
↓
Resultado
↓
Email
↓
Amazon
```

Testar em:

```txt
PT
EN
ES
```

---

# 38. CI/CD

Pipeline:

```txt
PR
↓
lint
↓
typecheck
↓
unit tests
↓
translation checks
↓
build
↓
Playwright
↓
Vercel Preview
```

Merge em `main`:

```txt
deploy production
```

---

# 39. Banco versionado

Estrutura:

```txt
supabase/
├── config.toml
├── migrations/
└── seed.sql
```

Regra:

> Schema é código.

Evitar alterações manuais não versionadas.

---

# 40. Ambientes

Inicialmente:

```txt
LOCAL
↓
PREVIEW
↓
PRODUCTION
```

Local:

```txt
Next.js
+
Supabase local
```

Preview:

```txt
Vercel Preview
```

Produção:

```txt
Vercel
+
Supabase hosted
```

---

# 41. Dashboard MVP

Não construir painel administrativo completo.

Usar inicialmente:

- Supabase Studio;
- SQL;
- database views.

Views recomendadas:

```txt
v_quiz_funnel
v_theme_demand
v_theme_by_age
v_theme_by_locale
v_open_feedback
v_attribution_by_content
```

---

# 42. ADRs

Criar:

```txt
docs/architecture/

ADR-001-modular-monolith.md
ADR-002-nextjs.md
ADR-003-supabase-postgresql.md
ADR-004-quiz-versioning.md
ADR-005-i18n-canonical-ids.md
ADR-006-anonymous-quiz-sessions.md
ADR-007-content-in-git.md
ADR-008-attribution-model.md
ADR-009-data-privacy.md
```

Estrutura de ADR:

```txt
Context
Decision
Alternatives
Consequences
Status
```

---

# 43. O que NÃO entra no MVP

Não implementar inicialmente:

- microservices;
- NestJS backend;
- Kubernetes;
- Redis obrigatório;
- IA para o quiz;
- classificação automática via LLM;
- conta infantil;
- login de pais;
- ecommerce próprio;
- CMS;
- aplicativo mobile;
- dashboard administrativo completo;
- recommendation ML;
- teste de personalidade infantil;
- gamificação;
- assinatura;
- área de membros.

---

# 44. Roadmap técnico do MVP

## T0 — Foundation

- repo;
- Next.js;
- TypeScript strict;
- Tailwind;
- next-intl;
- CI;
- Supabase local;
- estrutura modular.

## T1 — Marketing Site

- Home;
- coleção;
- livro B01;
- Amazon;
- SEO básico.

## T2 — Quiz Engine

- sessão;
- perguntas;
- scoring;
- resultado;
- themes.

## T3 — Research Layer

- feedback aberto;
- consentimento;
- views;
- análise manual.

## T4 — Lead Engine

- captura de email;
- Resend;
- React Email;
- listas de espera.

## T5 — Attribution

- UTMs;
- CUT_ID;
- PostHog;
- redirect Amazon.

## T6 — Production Hardening

- acessibilidade;
- SEO;
- rate limiting;
- Playwright;
- privacidade;
- monitorização.

---

# PARTE II — FUTURO

# 45. Objetivo da evolução futura

Transformar o site de uma ferramenta de aquisição e pesquisa em uma plataforma capaz de:

- acompanhar a jornada de leitura da família;
- recomendar sequências de livros;
- coletar feedback pós-leitura;
- identificar padrões editoriais;
- personalizar conteúdo;
- melhorar continuamente o catálogo.

---

# 46. Feedback pós-leitura

Cada livro poderá ter:

```txt
QR code
↓
/[locale]/feedback/[book]
```

Objetivo:

> entender o que aconteceu quando pais e filhos leram juntos.

---

# 47. Perguntas de feedback pós-leitura

Exemplos:

- Qual a idade da criança?
- Ela se identificou com a história?
- Alguma parte gerou conversa espontânea?
- Qual parte pareceu mais importante?
- O livro ajudou a conversar sobre o tema?
- Houve alguma parte confusa?
- A criança pediu para ler novamente?
- Qual tema gostariam de explorar depois?
- Qual frase ou pergunta da criança mais chamou sua atenção?

---

# 48. Banco para feedback futuro

```txt
reading_feedback
---------------
id
book_id
edition_id
locale
child_age_band
identification_score
conversation_score
clarity_score
reread_interest
next_theme_interest
child_question_optional
parent_observation_optional
created_at
```

---

# 49. Três pilares de dados

O sistema deve evoluir para combinar:

```txt
1. QUESTIONÁRIO
O que os pais precisam?

2. COMPORTAMENTO
O que eles clicam/compram/leem?

3. FEEDBACK PÓS-LEITURA
O que acontece durante e depois da leitura?
```

---

# 50. Jornada de leitura

Futuramente:

```txt
Temas explorados juntos

✓ Medo
✓ Raiva
○ Paciência
○ Verdade
○ Perdão
```

Não apresentar como progresso psicológico.

Apresentar como:

> jornada de leitura e conversas em família.

---

# 51. Recomendação de sequência de livros

Evoluir de:

```txt
1 tema
↓
1 livro
```

para:

```txt
Tema principal
↓
Tema secundário
↓
Sequência sugerida
```

Exemplo:

```txt
1. Medo
2. Esperar
3. Raiva
```

---

# 52. Perfil de desenvolvimento não clínico

Futuramente poderemos agrupar temas em dimensões:

```txt
autorregulação
segurança
relacionamento
responsabilidade
verdade
perseverança
empatia
autocontrole
```

Sem apresentar como diagnóstico psicológico.

---

# 53. IA para análise de feedback

Não entra no MVP.

Futuro:

```txt
original_text
↓
classifier / LLM
↓
structured analysis
```

Exemplo:

```txt
primary_theme: anger
secondary_theme: jealousy
context: siblings
trigger: toy_taken
behavior: aggression
desired_growth: self_control
```

---

# 54. Estrutura futura para IA

```txt
feedback_analysis
---------------
feedback_id
primary_theme
secondary_theme
context
trigger
behavior
desired_growth
model
model_version
confidence
review_status
```

Regra:

> nunca sobrescrever o texto original.

---

# 55. Uso editorial dos dados

Os dados podem orientar:

- ordem de publicação;
- situação concreta de cada história;
- conflitos narrativos;
- perguntas para pais;
- atividades;
- temas complementares;
- campanhas;
- vídeos.

Exemplo:

```txt
Tema:
raiva

Principal contexto:
conflito entre irmãos

↓
possível história:
Davi e Lia em conflito
```

---

# 56. Análise por idioma

Permitir futuramente:

```txt
PT
EN
ES
```

Comparar:

- temas mais frequentes;
- situações relatadas;
- performance de conteúdos;
- interesse em livros.

Sem alterar o core universal.

---

# 57. Adaptação regional futura

Somente mediante demanda explícita.

Possíveis variantes:

```txt
pt-BR
pt-PT
es-ES
es-MX
en-US
en-GB
```

Usar apenas para:

- exemplos;
- vocabulário;
- contexto cultural;
- links de compra;
- moeda;
- comunicação específica.

Não alterar scoring sem motivo metodológico claro.

---

# 58. Conta dos pais

Não necessária no MVP.

Futuramente pode permitir:

- guardar histórico;
- ver livros lidos;
- ver temas explorados;
- receber recomendações;
- refazer questionário;
- comparar respostas ao longo do tempo;
- guardar favoritos.

---

# 59. Login

Adicionar apenas quando houver valor real.

Possíveis métodos:

- magic link;
- email;
- social login.

Evitar senha tradicional se possível.

---

# 60. Reaplicação do questionário

Futuramente:

```txt
Questionário inicial
↓
livros e conversas
↓
questionário posterior
```

Objetivo:

- observar mudança na prioridade percebida pelo pai;
- nunca afirmar eficácia clínica;
- nunca diagnosticar.

---

# 61. Personalização dinâmica

Futuro:

> Conte uma situação que está acontecendo com seu filho.

Exemplo:

> Ele fica muito bravo quando o irmão pega os brinquedos.

Sistema identifica:

```txt
anger
jealousy
sibling_conflict
self_control
forgiveness
```

E recomenda uma sequência.

---

# 62. Recommendation Engine

Evolução possível:

## V1

Regras determinísticas.

## V2

Scoring mais sofisticado.

## V3

Combinação de:

- quiz;
- histórico;
- feedback;
- catálogo.

## V4

Modelos de recomendação.

Machine Learning só após existir volume real de dados.

---

# 63. Dashboard editorial futuro

Painel próprio poderá mostrar:

```txt
Demanda por tema
Tendência por período
Tema por idade
Tema por idioma
Feedback aberto
Palavras recorrentes
Contextos recorrentes
Livros recomendados
Conversão Amazon
Origem por vídeo
```

---

# 64. Pesquisa editorial

Criar funcionalidades futuras para:

- filtros por tema;
- filtros por idade;
- idioma;
- mercado;
- contexto;
- período;
- source content;
- CUT_ID.

---

# 65. Integração com sistema de conteúdo

Fluxo futuro:

```txt
Podcast / Live
↓
source_id
↓
ferramenta de cortes
↓
CUT_ID
↓
Reel / Short
↓
UTM
↓
Quiz
↓
Tema
↓
Lead
↓
Amazon
↓
Feedback
```

---

# 66. Inteligência de conteúdo

Futuramente medir:

```txt
CUT_ID
↓
views
↓
site visits
↓
quiz starts
↓
quiz completes
↓
leads
↓
Amazon clicks
↓
sales / attribution
```

Esses dados podem retornar para a ferramenta de cortes.

---

# 67. Amazon Attribution

Avaliar integração futura para aproximar:

```txt
amazon_click
↓
purchase
```

Manter redirect próprio para preservar flexibilidade.

---

# 68. Ecommerce próprio

Não necessário inicialmente.

Futuro possível se houver:

- bundles;
- PDFs;
- kits;
- assinatura;
- produtos digitais;
- venda direta;
- melhores margens;
- necessidade de CRM próprio.

---

# 69. Produtos futuros

O site deve poder suportar futuramente:

- livros;
- activity books;
- printables;
- audiobooks;
- cards;
- materiais para pais;
- materiais para igrejas;
- kits;
- bundles;
- assinaturas;
- material escolar;
- homeschooling.

---

# 70. Área para igrejas e escolas

Futuro:

```txt
/[locale]/igrejas
/[locale]/escolas
```

Possíveis recursos:

- compras em volume;
- material complementar;
- guias;
- licenciamento;
- contato comercial.

---

# 71. CMS futuro

Só considerar quando:

- equipe editorial crescer;
- pessoas não técnicas editarem conteúdo;
- publicação frequente justificar interface administrativa.

Possíveis opções:

- Sanity;
- Payload;
- Contentful;
- outro headless CMS.

A fonte canônica do quiz continua separada.

---

# 72. Dashboard administrativo futuro

Possíveis módulos:

```txt
/admin
├── analytics
├── quiz
├── feedback
├── catalog
├── leads
├── content
└── research
```

---

# 73. Design System futuro

Evoluir para biblioteca própria da marca.

Possíveis componentes:

- StoryCard;
- CharacterCard;
- FamilyJourney;
- ThemeJourney;
- ReadingFeedback;
- BookSequence;
- ParentGuide;
- PrintableCard.

---

# 74. Aplicativo

Não construir sem necessidade.

Só considerar se o comportamento indicar necessidade de:

- uso recorrente;
- leitura digital;
- progresso familiar;
- notificações;
- atividades;
- áudio;
- conteúdo offline.

---

# 75. Infra futura

Escalar somente mediante necessidade.

Possíveis adições:

- Redis;
- background jobs;
- queues;
- dedicated workers;
- object storage adicional;
- search engine;
- vector database;
- observability avançada.

Nada disso deve entrar por antecipação.

---

# 76. Princípio de evolução

A arquitetura deve seguir:

```txt
necessidade comprovada
↓
medição
↓
decisão
↓
evolução
```

Nunca:

```txt
"talvez precisemos no futuro"
↓
complexidade agora
```

---

# 77. Visão de longo prazo

A plataforma pode evoluir para este ciclo:

```txt
Conteúdo
↓
Audiência
↓
Questionário
↓
Dados sobre necessidades
↓
Livro
↓
Leitura em família
↓
Feedback
↓
Dados editoriais
↓
Próximo livro
↓
Novo conteúdo
↺
```

---

# 78. Resumo — AGORA

Construir:

- site da marca;
- PT / EN / ES;
- catálogo;
- B01;
- link Amazon;
- quiz;
- scoring determinístico;
- resultado;
- email;
- feedback aberto;
- analytics;
- UTMs;
- CUT_ID;
- PostHog;
- Supabase;
- Resend;
- SEO;
- privacidade;
- testes;
- CI/CD.

---

# 79. Resumo — FUTURO

Preparar arquitetura para:

- feedback pós-leitura;
- jornadas familiares;
- contas;
- histórico;
- sequências recomendadas;
- classificação de feedback;
- IA;
- dashboards editoriais;
- análise cultural;
- ecommerce próprio;
- bundles;
- igrejas;
- escolas;
- assinatura;
- produtos digitais;
- integração completa com motor de conteúdo.

---

# 80. Regra arquitetural central

> **O significado é canônico. A apresentação pode variar.**

Exemplos:

```txt
Medo
Miedo
Fear

↓
fear
```

```txt
Quando tenho medo
Cuando tengo miedo
When I'm Afraid

↓
B01_when-i-am-afraid_davi
```

O mesmo princípio deve existir em:

- temas;
- livros;
- perguntas;
- respostas;
- scoring;
- traduções;
- analytics;
- recomendações;
- feedback;
- conteúdo.

---

# 81. Próximos documentos recomendados

Depois deste documento, os próximos dois documentos técnicos recomendados são:

## `quiz-spec-v1.md`

Deve conter:

- perguntas;
- respostas;
- scoring;
- textos de resultado;
- CTAs;
- regras de recomendação;
- eventos de analytics do quiz.

## `content-acquisition-plan.md`

Deve conter:

- pilares editoriais;
- podcasts;
- canais;
- lives;
- critérios de seleção;
- direitos de uso;
- CUT_ID;
- volume de publicação;
- métricas;
- ligação com o quiz e Amazon.

Esses dois documentos transformam a arquitetura em plano operacional.
