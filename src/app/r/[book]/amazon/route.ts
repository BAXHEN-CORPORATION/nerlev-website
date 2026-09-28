import { NextResponse } from 'next/server'
import { listBooks } from '@/modules/catalog/application'
import { logAmazonClickBestEffort } from '@/modules/attribution/actions'
import { assertWithinRateLimit, RateLimitExceededError } from '@/shared/rate-limit'

// Amazon click redirect (spec §24: `/r/{book}/amazon`). Deliberately outside
// `[locale]` — not user-facing content, just a stable redirect utility.
// Click is logged before the redirect (spec §67) — best-effort, never blocks it.

function getBookByCode(code: string) {
  const normalized = code.toLowerCase()
  return listBooks().find((book) => book.code.toLowerCase() === normalized)
}

export async function GET(request: Request, context: RouteContext<'/r/[book]/amazon'>) {
  const { book: bookParam } = await context.params
  const book = getBookByCode(bookParam)

  if (!book) {
    return NextResponse.json({ error: 'Book not found' }, { status: 404 })
  }

  try {
    await assertWithinRateLimit('amazon_redirect', { limit: 60, windowSeconds: 300 })
  } catch (error) {
    if (error instanceof RateLimitExceededError) {
      return NextResponse.json({ error: 'Too many requests' }, { status: 429 })
    }
    throw error
  }

  const url = new URL(request.url)
  await logAmazonClickBestEffort({
    bookCode: book.code,
    sessionId: url.searchParams.get('session') ?? undefined,
    utmSource: url.searchParams.get('utm_source') ?? undefined,
    utmMedium: url.searchParams.get('utm_medium') ?? undefined,
    utmCampaign: url.searchParams.get('utm_campaign') ?? undefined,
    utmContent: url.searchParams.get('utm_content') ?? undefined,
  })

  return NextResponse.redirect(book.amazonUrl, 302)
}
