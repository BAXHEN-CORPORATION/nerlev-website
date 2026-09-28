import 'server-only'
import { createServerSupabaseClient } from '@/shared/infrastructure/supabase/client'
import type { ThemeId } from '@/shared/domain'
import type { QuizAnswer } from '../domain'
import type {
  CompleteSessionInput,
  QuizSessionRepository,
  SessionResult,
  StartSessionInput,
} from '../application/quiz-repository'

export function createSupabaseQuizSessionRepository(): QuizSessionRepository {
  const supabase = createServerSupabaseClient()

  return {
    async createSession(input: StartSessionInput) {
      const { data, error } = await supabase
        .from('quiz_sessions')
        .insert({
          quiz_version: input.quizVersion,
          scoring_version: input.scoringVersion,
          locale: input.locale,
          utm_source: input.utmSource,
          utm_medium: input.utmMedium,
          utm_campaign: input.utmCampaign,
          utm_content: input.utmContent,
          referrer: input.referrer,
        })
        .select('id')
        .single()

      if (error || !data) throw new Error(`Failed to create quiz session: ${error?.message}`)
      return { sessionId: data.id as string }
    },

    async saveAnswer(sessionId: string, answer: QuizAnswer) {
      const { error } = await supabase.from('quiz_answers').insert({
        session_id: sessionId,
        question_id: answer.questionId,
        answer_id: answer.optionId,
      })
      if (error) throw new Error(`Failed to save quiz answer: ${error.message}`)
    },

    async getAnswers(sessionId: string): Promise<QuizAnswer[]> {
      const { data, error } = await supabase
        .from('quiz_answers')
        .select('question_id, answer_id')
        .eq('session_id', sessionId)

      if (error) throw new Error(`Failed to load quiz answers: ${error.message}`)
      return (data ?? []).map((row) => ({
        questionId: row.question_id as string,
        optionId: row.answer_id as string,
      }))
    },

    async completeSession(sessionId: string, input: CompleteSessionInput) {
      const { error: updateError } = await supabase
        .from('quiz_sessions')
        .update({
          completed_at: new Date().toISOString(),
          child_age_band: input.childAgeBand,
          primary_theme_id: input.primaryThemeId,
          secondary_theme_id: input.secondaryThemeId,
        })
        .eq('id', sessionId)

      if (updateError) throw new Error(`Failed to complete quiz session: ${updateError.message}`)

      if (input.themeScores.length === 0) return

      const { error: scoresError } = await supabase.from('quiz_theme_scores').insert(
        input.themeScores.map((ts) => ({
          session_id: sessionId,
          theme_id: ts.themeId,
          score: ts.score,
          rank: ts.rank,
        })),
      )
      if (scoresError) throw new Error(`Failed to save quiz theme scores: ${scoresError.message}`)
    },

    async getSessionResult(sessionId: string): Promise<SessionResult | null> {
      const { data: session, error: sessionError } = await supabase
        .from('quiz_sessions')
        .select('id, primary_theme_id, secondary_theme_id, completed_at')
        .eq('id', sessionId)
        .maybeSingle()

      if (sessionError) throw new Error(`Failed to load quiz session: ${sessionError.message}`)
      if (!session || !session.completed_at) return null

      const { data: scores, error: scoresError } = await supabase
        .from('quiz_theme_scores')
        .select('theme_id, score, rank')
        .eq('session_id', sessionId)
        .order('rank', { ascending: true })

      if (scoresError) throw new Error(`Failed to load quiz theme scores: ${scoresError.message}`)

      return {
        sessionId: session.id as string,
        primaryThemeId: (session.primary_theme_id as ThemeId | null) ?? null,
        secondaryThemeId: (session.secondary_theme_id as ThemeId | null) ?? null,
        themeScores: (scores ?? []).map((row) => ({
          themeId: row.theme_id as ThemeId,
          score: row.score as number,
          rank: row.rank as number,
        })),
      }
    },
  }
}
