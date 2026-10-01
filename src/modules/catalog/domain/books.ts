import type { Book } from './book'

// Canonical ID from site-definitions-now-future.md §3.3: B01_when-i-am-afraid_davi.
// The slug is the canonical, English-based identity and stays the same across
// locales — only the presented title/subtitle change (spec §80).
export const books: Book[] = [
  {
    id: 'B01',
    code: 'B01',
    slug: 'when-i-am-afraid-davi',
    canonicalTheme: 'fear',
    title: {
      pt: 'Quando tenho medo',
      en: "When I'm Afraid",
      es: 'Cuando tengo miedo',
    },
    subtitle: {
      pt: 'Uma história de Davi',
      en: 'A Story of David',
      es: 'Una historia de David',
    },
    author: 'Leonardo Rebouças Batista',
    cover: {
      src: '/books/b01/cover.webp',
      width: 2513,
      height: 2550,
    },
    coverByLocale: {
      en: { src: '/books/b01/cover.en.webp', width: 2513, height: 2550 },
    },
    amazonUrl: 'https://www.amazon.es/dp/B0HKYZ1LHN',
    amazonUrlByLocale: {
      en: 'https://www.amazon.com/dp/B0HLP4SH2D',
    },
  },
]
