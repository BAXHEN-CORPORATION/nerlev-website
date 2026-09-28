import type { MetadataRoute } from 'next'
import { routing } from '@/lib/i18n/routing'
import { listBooks } from '@/modules/catalog/application'
import { absoluteUrl } from '@/shared/seo/site-url'

// /resultado/* is dynamic per anonymous session and already noindex — excluded here.

function languageMap(path: string): Record<string, string> {
  return Object.fromEntries(routing.locales.map((l) => [l, absoluteUrl(l, path)]))
}

export default function sitemap(): MetadataRoute.Sitemap {
  const books = listBooks()
  const entries: MetadataRoute.Sitemap = []

  for (const locale of routing.locales) {
    entries.push({
      url: absoluteUrl(locale, ''),
      alternates: { languages: languageMap('') },
    })
    entries.push({
      url: absoluteUrl(locale, '/livros'),
      alternates: { languages: languageMap('/livros') },
    })
    for (const book of books) {
      entries.push({
        url: absoluteUrl(locale, `/livros/${book.slug}`),
        alternates: { languages: languageMap(`/livros/${book.slug}`) },
      })
    }
  }

  return entries
}
