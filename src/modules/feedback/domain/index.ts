// modules/feedback/domain — feedback aberto do quiz + consentimento de pesquisa
// Regra de dependencia: Regras de negocio e tipos puros do modulo. Nao importa de application/infrastructure/ui.
export type { FeedbackType, OpenFeedbackEntry } from './open-feedback'
export type { ConsentPurpose, ConsentGrant } from './consent'
