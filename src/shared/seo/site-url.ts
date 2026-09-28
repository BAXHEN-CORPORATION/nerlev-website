import { publicEnv } from '@/shared/infrastructure/env/env.client'
import type { Locale } from '@/lib/i18n/routing'

/** Absolute URL for a locale-prefixed path, built from NEXT_PUBLIC_SITE_URL — swap the
 * env var for the real domain once it exists, no code changes needed. */
export function absoluteUrl(locale: Locale, path = ''): string {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`
  return `${publicEnv.NEXT_PUBLIC_SITE_URL}/${locale}${normalizedPath === '/' ? '' : normalizedPath}`
}

export function siteUrl(): string {
  return publicEnv.NEXT_PUBLIC_SITE_URL
}

/** Absolute URL for a locale-independent static asset under public/ (e.g. book covers) — no locale prefix. */
export function assetUrl(path: string): string {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`
  return `${publicEnv.NEXT_PUBLIC_SITE_URL}${normalizedPath}`
}
