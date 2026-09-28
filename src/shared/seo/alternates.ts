import { routing } from '@/lib/i18n/routing'
import type { Locale } from '@/lib/i18n/routing'
import { absoluteUrl } from './site-url'

/** `alternates` metadata (canonical + hreflang) for a locale-prefixed path, spec §36. */
export function buildAlternates(locale: Locale, path = '') {
  const languages = Object.fromEntries(
    routing.locales.map((l) => [l, absoluteUrl(l, path)]),
  ) as Record<Locale, string>

  return {
    canonical: absoluteUrl(locale, path),
    languages,
  }
}
