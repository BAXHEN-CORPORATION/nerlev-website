/** Port implemented by infrastructure (Supabase) — spec §17-19 dependency rule. */
export interface LeadRepository {
  /** Creates the lead if the email is new (unique constraint), or reuses the existing row for a repeat visitor. */
  upsertLead(email: string, locale: string): Promise<{ leadId: string }>
  linkSessionToLead(leadId: string, sessionId: string): Promise<void>
  recordMarketingConsent(leadId: string, sessionId: string, policyVersion: string): Promise<void>
}
