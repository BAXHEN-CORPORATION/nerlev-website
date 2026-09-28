import type { AmazonClickInput } from '../domain'

/** Port implemented by infrastructure (Supabase) — spec §17-19 dependency rule. */
export interface AmazonClickRepository {
  logClick(input: AmazonClickInput): Promise<void>
}
