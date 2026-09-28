// modules/quiz/application — casos de uso do quiz: iniciar sessao, responder, concluir, ler resultado.
// Regra de dependencia: Casos de uso, orquestra domain + interfaces de repository. Nao importa de infrastructure/ui.
export type {
  CompleteSessionInput,
  QuizSessionRepository,
  SessionResult,
  StartSessionInput,
} from './quiz-repository'
export { startSession } from './start-session'
export { submitAnswer, InvalidAnswerError } from './submit-answer'
export { completeSession } from './complete-session'
export { getSessionResult } from './get-session-result'
