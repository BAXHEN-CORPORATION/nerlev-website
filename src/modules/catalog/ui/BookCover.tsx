import Image from 'next/image'
import type { Locale } from '@/lib/i18n/routing'
import { coverFor, type Book } from '../domain'

export function BookCover({
  book,
  locale,
  alt,
  priority = false,
}: {
  book: Book
  locale: Locale
  alt: string
  priority?: boolean
}) {
  const cover = coverFor(book, locale)
  return (
    <Image
      src={cover.src}
      alt={alt}
      width={cover.width}
      height={cover.height}
      priority={priority}
      className="rounded-xl shadow-lg"
    />
  )
}
