import type { EmailSender, QuizResultSummary } from './email-sender'
import type { LeadRepository } from './lead-repository'

export interface CaptureLeadInput {
  email: string
  locale: string
  sessionId: string
  marketingConsent: boolean
  policyVersion: string
  resultSummary: QuizResultSummary
}

export interface CaptureLeadDeps {
  repository: LeadRepository
  emailSender: EmailSender
}

export async function captureLead(deps: CaptureLeadDeps, input: CaptureLeadInput) {
  const { leadId } = await deps.repository.upsertLead(input.email, input.locale)
  await deps.repository.linkSessionToLead(leadId, input.sessionId)

  if (input.marketingConsent) {
    await deps.repository.recordMarketingConsent(leadId, input.sessionId, input.policyVersion)
  }

  // Email delivery is best-effort — the lead is already saved either way (spec §14:
  // seeing the result is never blocked by, or dependent on, email working).
  try {
    await deps.emailSender.sendQuizResultEmail(input.email, input.locale, input.resultSummary)
  } catch (error) {
    // Log the error only — never the email/resultSummary (spec §29: "logs sem feedback sensível").
    console.error('Failed to send quiz result email:', error)
  }

  return { leadId }
}
