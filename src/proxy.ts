import createMiddleware from 'next-intl/middleware'
import type { NextRequest } from 'next/server'
import { routing } from './lib/i18n/routing'

const handleI18nRouting = createMiddleware(routing)

export function proxy(request: NextRequest) {
  return handleI18nRouting(request)
}

export const config = {
  // `/r/*` is the Amazon redirect utility (spec §24) — not locale-prefixed content.
  matcher: ['/((?!api|_next|r/|.*\\..*).*)'],
}
