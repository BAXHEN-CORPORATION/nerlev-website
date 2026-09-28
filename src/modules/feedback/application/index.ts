// modules/feedback/application — caso de uso: registrar feedback aberto + consentimento
// Regra de dependencia: Casos de uso, orquestra domain + interfaces de repository. Nao importa de infrastructure/ui.
export type { FeedbackRepository } from './feedback-repository'
export { submitOpenFeedback } from './submit-open-feedback'
export type { SubmitOpenFeedbackInput } from './submit-open-feedback'
