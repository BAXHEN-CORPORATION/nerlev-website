// modules/feedback/infrastructure — implementacao Supabase do FeedbackRepository (schema nerlev).
// Regra de dependencia: Implementacoes concretas (Supabase, email, etc) das interfaces definidas por domain/application. Nunca importado por domain/application.
export { createSupabaseFeedbackRepository } from './feedback.repository'
