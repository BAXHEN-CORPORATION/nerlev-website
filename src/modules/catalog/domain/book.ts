import type { Locale } from '@/lib/i18n/routing'
import type { LocalizedText, ThemeId } from '@/shared/domain'

export type { LocalizedText } from '@/shared/domain'

export interface BookCover {
  src: string
  width: number
  height: number
}

export interface Book {
  /** Canonical, language-independent identity (spec §3.3, §80). */
  id: string
  code: string
  slug: string
  /** Canonical theme_id this book addresses (spec §20.2). */
  canonicalTheme: ThemeId
  title: LocalizedText
  subtitle: LocalizedText
  author: string
  cover: BookCover
  /** Per-locale cover edition; falls back to `cover`. */
  coverByLocale?: Partial<Record<Locale, BookCover>>
  amazonUrl: string
  /** Per-locale Amazon listing; falls back to `amazonUrl`. */
  amazonUrlByLocale?: Partial<Record<Locale, string>>
}

export function coverFor(book: Book, locale: Locale): BookCover {
  return book.coverByLocale?.[locale] ?? book.cover
}

export function amazonUrlFor(book: Book, locale: Locale): string {
  return book.amazonUrlByLocale?.[locale] ?? book.amazonUrl
}
