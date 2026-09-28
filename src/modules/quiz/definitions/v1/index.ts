// modules/quiz/definitions/v1 — spec §11: perguntas/opções/scoring/temas versionados em
// git, não em CMS. Mudar conteúdo aqui é seguro; mudar a lógica de scoring exige v2.
export { themes, getThemeById } from './themes'
export { questions, getQuestionById } from './questions'
export { ScoringV1 } from './scoring'
