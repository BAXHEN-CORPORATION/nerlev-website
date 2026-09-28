// modules/quiz/domain — tipos puros: temas, perguntas, respostas, scoring.
// Regra de dependencia: Regras de negocio e tipos puros do modulo. Nao importa de application/infrastructure/ui.
export type { Theme, ThemeId } from './theme'
export type { Question, QuestionOption, ThemeDeltas } from './question'
export type { QuizAnswer } from './answer'
export type { ScoringStrategy, QuizScore, ThemeScore } from './scoring-strategy'
