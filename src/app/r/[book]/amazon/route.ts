import { NextResponse } from 'next/server'
import { listBooks } from '@/modules/catalog/application'

// Amazon click redirect (spec §24: `/r/{book}/amazon`). Deliberately outside
// `[locale]` — not user-facing content, just a stable redirect utility.
// No DB logging yet (that's T5/attribution) — a plain 302 for now.

function getBookByCode(code: string) {
  const normalized = code.toLowerCase()
  return listBooks().find((book) => book.code.toLowerCase() === normalized)
}

export async function GET(_request: Request, context: RouteContext<'/r/[book]/amazon'>) {
  const { book: bookParam } = await context.params
  const book = getBookByCode(bookParam)

  if (!book) {
    return NextResponse.json({ error: 'Book not found' }, { status: 404 })
  }

  return NextResponse.redirect(book.amazonUrl, 302)
}
