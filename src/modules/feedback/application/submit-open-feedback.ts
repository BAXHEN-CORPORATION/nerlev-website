import type { OpenFeedbackEntry } from '../domain'
import type { FeedbackRepository } from './feedback-repository'

export interface SubmitOpenFeedbackInput {
  sessionId: string
  locale: string
  /** Gate: without consent, nothing is written — not even a declined consent record (spec §3.6). */
  consented: boolean
  policyVersion: string
  entries: OpenFeedbackEntry[]
}

export async function submitOpenFeedback(
  repository: FeedbackRepository,
  input: SubmitOpenFeedbackInput,
) {
  if (!input.consented) return

  await repository.recordConsent(input.sessionId, {
    purpose: 'editorial_research',
    policyVersion: input.policyVersion,
  })

  for (const entry of input.entries) {
    if (entry.text.trim().length === 0) continue
    await repository.saveOpenFeedback(input.sessionId, input.locale, entry)
  }
}
