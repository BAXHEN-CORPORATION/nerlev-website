// modules/attribution/infrastructure — implementacao Supabase do AmazonClickRepository (schema nerlev).
// Regra de dependencia: Implementacoes concretas (Supabase, email, etc) das interfaces definidas por domain/application. Nunca importado por domain/application.
export { createSupabaseAmazonClickRepository } from './amazon-click.repository'
