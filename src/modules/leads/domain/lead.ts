export interface Lead {
  id: string
  email: string
  locale: string
}

export interface CaptureLeadInput {
  email: string
  locale: string
  sessionId: string
  marketingConsent: boolean
}
