import type { ConsentGrant, OpenFeedbackEntry } from '../domain'

/** Port implemented by infrastructure (Supabase) — spec §17-19 dependency rule. */
export interface FeedbackRepository {
  saveOpenFeedback(sessionId: string, locale: string, entry: OpenFeedbackEntry): Promise<void>
  recordConsent(sessionId: string, grant: ConsentGrant): Promise<void>
}
