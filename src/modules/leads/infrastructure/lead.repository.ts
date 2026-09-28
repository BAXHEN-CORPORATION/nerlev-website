import 'server-only'
import { createServerSupabaseClient } from '@/shared/infrastructure/supabase/client'
import type { LeadRepository } from '../application/lead-repository'

export function createSupabaseLeadRepository(): LeadRepository {
  const supabase = createServerSupabaseClient()

  return {
    async upsertLead(email: string, locale: string) {
      const { data, error } = await supabase
        .from('leads')
        .upsert({ email, locale }, { onConflict: 'email' })
        .select('id')
        .single()

      if (error || !data) throw new Error(`Failed to upsert lead: ${error?.message}`)
      return { leadId: data.id as string }
    },

    async linkSessionToLead(leadId: string, sessionId: string) {
      // Pure junction table, nothing to update on conflict — DO NOTHING only needs
      // INSERT privilege, unlike DO UPDATE (which needs an UPDATE grant too).
      const { error } = await supabase
        .from('lead_quiz_sessions')
        .upsert(
          { lead_id: leadId, session_id: sessionId },
          { onConflict: 'lead_id,session_id', ignoreDuplicates: true },
        )

      if (error) throw new Error(`Failed to link session to lead: ${error.message}`)
    },

    async recordMarketingConsent(leadId: string, sessionId: string, policyVersion: string) {
      const { error } = await supabase.from('consent_records').insert({
        lead_id: leadId,
        session_id: sessionId,
        purpose: 'marketing',
        policy_version: policyVersion,
        granted_at: new Date().toISOString(),
      })
      if (error) throw new Error(`Failed to record marketing consent: ${error.message}`)
    },
  }
}
