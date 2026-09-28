// modules/quiz/infrastructure — implementacao Supabase do QuizSessionRepository (schema nerlev).
// Regra de dependencia: Implementacoes concretas (Supabase, email, etc) das interfaces definidas por domain/application. Nunca importado por domain/application.
export { createSupabaseQuizSessionRepository } from './quiz-session.repository'
