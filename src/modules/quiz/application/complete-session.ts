import { getQuestionById, ScoringV1 } from '../definitions/v1'
import type { QuizSessionRepository } from './quiz-repository'

export async function completeSession(repository: QuizSessionRepository, sessionId: string) {
  const answers = await repository.getAnswers(sessionId)
  const score = ScoringV1.calculate(answers)

  const ageAnswer = answers.find((a) => getQuestionById(a.questionId)?.kind === 'demographic')

  await repository.completeSession(sessionId, {
    childAgeBand: ageAnswer?.optionId,
    primaryThemeId: score.primaryThemeId,
    secondaryThemeId: score.secondaryThemeId,
    themeScores: score.themeScores,
  })

  return score
}
