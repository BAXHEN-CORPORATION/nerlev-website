/** spec §22.4 — os dois tipos de pergunta aberta do quiz (§8.3). */
export type FeedbackType = 'current_challenge' | 'desired_growth'

export interface OpenFeedbackEntry {
  feedbackType: FeedbackType
  text: string
}
