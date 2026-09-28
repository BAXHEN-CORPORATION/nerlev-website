import 'server-only'
import { createServerSupabaseClient } from '@/shared/infrastructure/supabase/client'
import type { ConsentGrant, OpenFeedbackEntry } from '../domain'
import type { FeedbackRepository } from '../application/feedback-repository'

export function createSupabaseFeedbackRepository(): FeedbackRepository {
  const supabase = createServerSupabaseClient()

  return {
    async saveOpenFeedback(sessionId: string, locale: string, entry: OpenFeedbackEntry) {
      const { error } = await supabase.from('open_feedback').insert({
        session_id: sessionId,
        feedback_type: entry.feedbackType,
        original_text: entry.text,
        locale,
        research_consent: true,
      })
      if (error) throw new Error(`Failed to save open feedback: ${error.message}`)
    },

    async recordConsent(sessionId: string, grant: ConsentGrant) {
      const { error } = await supabase.from('consent_records').insert({
        session_id: sessionId,
        purpose: grant.purpose,
        policy_version: grant.policyVersion,
        granted_at: new Date().toISOString(),
      })
      if (error) throw new Error(`Failed to record consent: ${error.message}`)
    },
  }
}
