import type { QuizAnswer, ThemeScore } from '../domain'
import type { ThemeId } from '@/shared/domain'

export interface StartSessionInput {
  quizVersion: number
  scoringVersion: number
  locale: string
  utmSource?: string
  utmMedium?: string
  utmCampaign?: string
  utmContent?: string
  referrer?: string
}

export interface CompleteSessionInput {
  childAgeBand?: string
  primaryThemeId: ThemeId | null
  secondaryThemeId: ThemeId | null
  themeScores: ThemeScore[]
}

export interface SessionResult {
  sessionId: string
  primaryThemeId: ThemeId | null
  secondaryThemeId: ThemeId | null
  themeScores: ThemeScore[]
}

/** Port implemented by infrastructure (Supabase) — spec §17-19 dependency rule. */
export interface QuizSessionRepository {
  createSession(input: StartSessionInput): Promise<{ sessionId: string }>
  saveAnswer(sessionId: string, answer: QuizAnswer): Promise<void>
  getAnswers(sessionId: string): Promise<QuizAnswer[]>
  completeSession(sessionId: string, input: CompleteSessionInput): Promise<void>
  getSessionResult(sessionId: string): Promise<SessionResult | null>
}
