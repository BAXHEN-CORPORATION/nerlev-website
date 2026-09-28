'use server'

// Composition root do modulo leads — mesmo motivo de quiz/feedback (actions.ts):
// unico lugar que conhece application + infrastructure, e aqui tambem monta o resumo
// do resultado a partir de quiz + catalog (dados publicos desses modulos).

import { z } from 'zod'
import { isValidLocale } from '@/lib/i18n/routing'
import { publicEnv } from '@/shared/infrastructure/env/env.client'
import { assertWithinRateLimit } from '@/shared/rate-limit'
import { getQuizResult } from '@/modules/quiz/actions'
import { getThemeById } from '@/modules/quiz/definitions/v1'
import { listBooks } from '@/modules/catalog/application'
import { captureLead as captureLeadUseCase } from './application'
import { createResendEmailSender, createSupabaseLeadRepository } from './infrastructure'

const POLICY_VERSION = 'v1-draft'

const captureInputSchema = z.object({
  email: z.email(),
  locale: z.string(),
  sessionId: z.uuid(),
  marketingConsent: z.boolean(),
  // Honeypot (spec §29): hidden field a real user never sees or fills. Any bot that
  // autofills it gets a fake success below, silently, without writing anything.
  website: z.string().optional(),
})

export async function captureQuizLead(input: z.infer<typeof captureInputSchema>) {
  const parsed = captureInputSchema.parse(input)
  if (!isValidLocale(parsed.locale)) throw new Error(`Invalid locale: ${parsed.locale}`)
  const locale = parsed.locale

  if (parsed.website) {
    return { leadId: 'honeypot' }
  }

  await assertWithinRateLimit('lead_capture', { limit: 5, windowSeconds: 3600 })

  const result = await getQuizResult({ sessionId: parsed.sessionId })
  if (!result || !result.primaryThemeId) {
    throw new Error('Cannot capture a lead for a session with no result yet.')
  }

  const theme = getThemeById(result.primaryThemeId)
  const book = listBooks().find((b) => b.canonicalTheme === result.primaryThemeId)

  const { leadId } = await captureLeadUseCase(
    {
      repository: createSupabaseLeadRepository(),
      emailSender: createResendEmailSender(),
    },
    {
      email: parsed.email,
      locale,
      sessionId: parsed.sessionId,
      marketingConsent: parsed.marketingConsent,
      policyVersion: POLICY_VERSION,
      resultSummary: {
        themeLabel: theme?.label[locale] ?? result.primaryThemeId,
        tips: theme?.tips.map((tip) => tip[locale]) ?? [],
        bookTitle: book?.title[locale],
        // Absolute URL — this link is embedded in an email, relative paths don't work there.
        bookAmazonUrl: book
          ? `${publicEnv.NEXT_PUBLIC_SITE_URL}/r/${book.code.toLowerCase()}/amazon`
          : undefined,
      },
    },
  )

  return { leadId }
}
