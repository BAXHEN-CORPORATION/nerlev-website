import type { QuizAnswer } from '../domain'
import { getQuestionById } from '../definitions/v1'
import type { QuizSessionRepository } from './quiz-repository'

export class InvalidAnswerError extends Error {}

export async function submitAnswer(
  repository: QuizSessionRepository,
  sessionId: string,
  answer: QuizAnswer,
) {
  const question = getQuestionById(answer.questionId)
  const option = question?.options.find((o) => o.id === answer.optionId)
  if (!question || !option) {
    throw new InvalidAnswerError(`Unknown question/option: ${answer.questionId}/${answer.optionId}`)
  }

  await repository.saveAnswer(sessionId, answer)
}
