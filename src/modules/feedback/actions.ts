'use server'

// Composition root do modulo feedback — mesmo motivo do quiz (src/modules/quiz/actions.ts):
// Server Actions sao o unico ponto que conhece application + infrastructure ao mesmo tempo.

import { z } from 'zod'
import { assertWithinRateLimit } from '@/shared/rate-limit'
import { submitOpenFeedback as submitOpenFeedbackUseCase } from './application'
import { createSupabaseFeedbackRepository } from './infrastructure'

const POLICY_VERSION = 'v1-draft'

const entrySchema = z.object({
  feedbackType: z.enum(['current_challenge', 'desired_growth']),
  text: z.string().max(2000),
})

const submitInputSchema = z.object({
  sessionId: z.uuid(),
  locale: z.string(),
  consented: z.boolean(),
  entries: z.array(entrySchema),
})

export async function submitQuizOpenFeedback(input: z.infer<typeof submitInputSchema>) {
  const parsed = submitInputSchema.parse(input)
  await assertWithinRateLimit('feedback_submit', { limit: 10, windowSeconds: 600 })

  await submitOpenFeedbackUseCase(createSupabaseFeedbackRepository(), {
    sessionId: parsed.sessionId,
    locale: parsed.locale,
    consented: parsed.consented,
    policyVersion: POLICY_VERSION,
    entries: parsed.entries,
  })

  return { ok: true }
}
