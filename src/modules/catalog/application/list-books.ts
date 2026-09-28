import { books } from '../domain'
import type { Book } from '../domain'

export function listBooks(): Book[] {
  return books
}
