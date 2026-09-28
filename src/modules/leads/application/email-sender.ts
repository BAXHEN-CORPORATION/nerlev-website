export interface QuizResultSummary {
  themeLabel: string
  tips: string[]
  bookTitle?: string
  bookAmazonUrl?: string
}

/** Port implemented by infrastructure (Resend) — spec §17-19 dependency rule. */
export interface EmailSender {
  sendQuizResultEmail(to: string, locale: string, summary: QuizResultSummary): Promise<void>
}
