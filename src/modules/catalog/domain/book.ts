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
  amazonUrl: string
}
