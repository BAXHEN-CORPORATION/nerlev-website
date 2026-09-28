// modules/leads/infrastructure — implementacoes concretas: Supabase (leads) + Resend (email)
// Regra de dependencia: Implementacoes concretas (Supabase, email, etc) das interfaces definidas por domain/application. Nunca importado por domain/application.
export { createSupabaseLeadRepository } from './lead.repository'
export { createResendEmailSender } from './resend-email-sender'
