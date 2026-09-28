import type { QuizSessionRepository } from './quiz-repository'

export async function getSessionResult(repository: QuizSessionRepository, sessionId: string) {
  return repository.getSessionResult(sessionId)
}
