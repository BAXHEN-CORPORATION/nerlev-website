/** spec §22.7 — propósitos de consentimento. `marketing` nasce em T4 (Lead Engine). */
export type ConsentPurpose = 'editorial_research' | 'marketing'

export interface ConsentGrant {
  purpose: ConsentPurpose
  policyVersion: string
}
