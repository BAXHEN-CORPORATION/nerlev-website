import { books } from '../domain'
import type { Book } from '../domain'

export function getBookBySlug(slug: string): Book | undefined {
  return books.find((book) => book.slug === slug)
}
