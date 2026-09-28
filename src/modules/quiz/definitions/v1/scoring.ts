import type { QuizAnswer, QuizScore, ScoringStrategy, ThemeScore } from '../../domain'
import type { ThemeId } from '@/shared/domain'
import { getQuestionById } from './questions'
import { themes } from './themes'

// V1 — soma determinística dos deltas de cada opção escolhida (spec §9-10). Empate é
// resolvido pela ordem canônica de `themes` (spec §3.1), mantendo o resultado estável
// pro mesmo conjunto de respostas.
export const ScoringV1: ScoringStrategy = {
  version: 1,
  calculate(answers: QuizAnswer[]): QuizScore {
    const totals = new Map<ThemeId, number>()

    for (const answer of answers) {
      const question = getQuestionById(answer.questionId)
      const option = question?.options.find((o) => o.id === answer.optionId)
      if (!option) continue

      for (const [themeId, points] of Object.entries(option.deltas)) {
        const current = totals.get(themeId as ThemeId) ?? 0
        totals.set(themeId as ThemeId, current + (points ?? 0))
      }
    }

    const themeScores: ThemeScore[] = themes
      .map((theme) => ({ themeId: theme.id, score: totals.get(theme.id) ?? 0 }))
      .filter((entry) => entry.score > 0)
      .sort((a, b) => b.score - a.score)
      .map((entry, index) => ({ ...entry, rank: index + 1 }))

    return {
      primaryThemeId: themeScores[0]?.themeId ?? null,
      secondaryThemeId: themeScores[1]?.themeId ?? null,
      themeScores,
    }
  },
}
