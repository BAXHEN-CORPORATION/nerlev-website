import type { QuizSessionRepository, StartSessionInput } from './quiz-repository'

export async function startSession(repository: QuizSessionRepository, input: StartSessionInput) {
  return repository.createSession(input)
}
