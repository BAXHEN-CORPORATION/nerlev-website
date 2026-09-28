import { Link } from '@/lib/i18n/routing'
import type { Locale } from '@/lib/i18n/routing'
import type { Book } from '../domain'
import { BookCover } from './BookCover'

export function BookCard({ book, locale }: { book: Book; locale: Locale }) {
  const title = book.title[locale]
  const subtitle = book.subtitle[locale]

  return (
    <Link
      href={`/livros/${book.slug}`}
      className="flex flex-col items-center gap-4 text-center transition-opacity hover:opacity-80"
    >
      <div className="w-48">
        <BookCover book={book} alt={title} />
      </div>
      <div>
        <h3 className="font-display text-xl font-semibold text-deep-blue">{title}</h3>
        <p className="text-warm-gray text-sm">{subtitle}</p>
      </div>
    </Link>
  )
}
