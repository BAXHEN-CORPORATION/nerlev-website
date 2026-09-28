import { describe, expect, it, vi } from 'vitest'
import { captureLead } from '@/modules/leads/application'
import type { EmailSender, LeadRepository } from '@/modules/leads/application'

function makeRepository(): LeadRepository {
  return {
    upsertLead: vi.fn().mockResolvedValue({ leadId: 'lead-1' }),
    linkSessionToLead: vi.fn().mockResolvedValue(undefined),
    recordMarketingConsent: vi.fn().mockResolvedValue(undefined),
  }
}

const summary = { themeLabel: 'Medo', tips: ['dica 1', 'dica 2'] }

describe('captureLead', () => {
  it('saves the lead even when email delivery fails', async () => {
    const repository = makeRepository()
    const emailSender: EmailSender = {
      sendQuizResultEmail: vi.fn().mockRejectedValue(new Error('Resend is down')),
    }

    const result = await captureLead(
      { repository, emailSender },
      {
        email: 'parent@example.com',
        locale: 'pt',
        sessionId: 'session-1',
        marketingConsent: false,
        policyVersion: 'v1-draft',
        resultSummary: summary,
      },
    )

    expect(result.leadId).toBe('lead-1')
    expect(repository.upsertLead).toHaveBeenCalledWith('parent@example.com', 'pt')
    expect(repository.linkSessionToLead).toHaveBeenCalledWith('lead-1', 'session-1')
  })

  it('only records marketing consent when explicitly granted', async () => {
    const repository = makeRepository()
    const emailSender: EmailSender = { sendQuizResultEmail: vi.fn().mockResolvedValue(undefined) }

    await captureLead(
      { repository, emailSender },
      {
        email: 'parent@example.com',
        locale: 'pt',
        sessionId: 'session-1',
        marketingConsent: false,
        policyVersion: 'v1-draft',
        resultSummary: summary,
      },
    )
    expect(repository.recordMarketingConsent).not.toHaveBeenCalled()

    await captureLead(
      { repository, emailSender },
      {
        email: 'parent@example.com',
        locale: 'pt',
        sessionId: 'session-1',
        marketingConsent: true,
        policyVersion: 'v1-draft',
        resultSummary: summary,
      },
    )
    expect(repository.recordMarketingConsent).toHaveBeenCalledWith(
      'lead-1',
      'session-1',
      'v1-draft',
    )
  })
})
