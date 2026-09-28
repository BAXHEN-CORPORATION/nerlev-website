import Image from 'next/image'
import type { Book } from '../domain'

export function BookCover({
  book,
  alt,
  priority = false,
}: {
  book: Book
  alt: string
  priority?: boolean
}) {
  return (
    <Image
      src={book.cover.src}
      alt={alt}
      width={book.cover.width}
      height={book.cover.height}
      priority={priority}
      className="rounded-xl shadow-lg"
    />
  )
}
