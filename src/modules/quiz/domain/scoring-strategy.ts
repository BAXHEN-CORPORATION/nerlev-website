import type { ThemeId } from '@/shared/domain'
import type { QuizAnswer } from './answer'

export interface ThemeScore {
  themeId: ThemeId
  score: number
  rank: number
}

export interface QuizScore {
  primaryThemeId: ThemeId | null
  secondaryThemeId: ThemeId | null
  themeScores: ThemeScore[]
}

/** spec §10: versioned, swappable scoring algorithm (ScoringV1, ScoringV2, ...). */
export interface ScoringStrategy {
  version: number
  calculate(answers: QuizAnswer[]): QuizScore
}
