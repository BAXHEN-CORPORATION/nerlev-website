// modules/leads/application — caso de uso: capturar lead + vincular sessao + email best-effort
// Regra de dependencia: Casos de uso, orquestra domain + interfaces de repository. Nao importa de infrastructure/ui.
export type { LeadRepository } from './lead-repository'
export type { EmailSender, QuizResultSummary } from './email-sender'
export { captureLead } from './capture-lead'
export type { CaptureLeadInput, CaptureLeadDeps } from './capture-lead'
