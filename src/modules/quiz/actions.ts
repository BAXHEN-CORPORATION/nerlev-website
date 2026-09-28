'use server'

// Composition root do modulo quiz: unico lugar que conhece tanto `application`
// (casos de uso/interfaces) quanto `infrastructure` (implementacao concreta Supabase).
// Server Actions do Next sao o ponto de entrada certo pra essa fiacao — nem domain,
// nem application, nem ui devem importar infrastructure diretamente.

import { z } from 'zod'
import { isValidLocale } from '@/lib/i18n/routing'
import { assertWithinRateLimit } from '@/shared/rate-limit'
import {
  completeSession as completeSessionUseCase,
  getSessionResult as getSessionResultUseCase,
  InvalidAnswerError,
  startSession as startSessionUseCase,
  submitAnswer as submitAnswerUseCase,
} from './application'
import { ScoringV1, questions } from './definitions/v1'
import { createSupabaseQuizSessionRepository } from './infrastructure'

const QUIZ_VERSION = 1

function repository() {
  return createSupabaseQuizSessionRepository()
}

const startInputSchema = z.object({
  locale: z.string(),
  utmSource: z.string().optional(),
  utmMedium: z.string().optional(),
  utmCampaign: z.string().optional(),
  utmContent: z.string().optional(),
  referrer: z.string().optional(),
})

export async function startQuizSession(input: z.infer<typeof startInputSchema>) {
  const parsed = startInputSchema.parse(input)
  if (!isValidLocale(parsed.locale)) throw new Error(`Invalid locale: ${parsed.locale}`)
  await assertWithinRateLimit('quiz_start', { limit: 20, windowSeconds: 600 })

  const { sessionId } = await startSessionUseCase(repository(), {
    quizVersion: QUIZ_VERSION,
    scoringVersion: ScoringV1.version,
    locale: parsed.locale,
    utmSource: parsed.utmSource,
    utmMedium: parsed.utmMedium,
    utmCampaign: parsed.utmCampaign,
    utmContent: parsed.utmContent,
    referrer: parsed.referrer,
  })

  return { sessionId, totalQuestions: questions.length }
}

const answerInputSchema = z.object({
  sessionId: z.uuid(),
  questionId: z.string(),
  optionId: z.string(),
})

export async function submitQuizAnswer(input: z.infer<typeof answerInputSchema>) {
  const parsed = answerInputSchema.parse(input)

  try {
    await submitAnswerUseCase(repository(), parsed.sessionId, {
      questionId: parsed.questionId,
      optionId: parsed.optionId,
    })
  } catch (error) {
    if (error instanceof InvalidAnswerError) {
      throw new Error('Invalid answer submitted.')
    }
    throw error
  }

  const currentIndex = questions.findIndex((q) => q.id === parsed.questionId)
  const nextQuestion = questions[currentIndex + 1]

  return { nextQuestionId: nextQuestion?.id ?? null }
}

const completeInputSchema = z.object({ sessionId: z.uuid() })

export async function completeQuizSession(input: z.infer<typeof completeInputSchema>) {
  const parsed = completeInputSchema.parse(input)
  const score = await completeSessionUseCase(repository(), parsed.sessionId)
  return score
}

const resultInputSchema = z.object({ sessionId: z.uuid() })

export async function getQuizResult(input: z.infer<typeof resultInputSchema>) {
  const parsed = resultInputSchema.parse(input)
  return getSessionResultUseCase(repository(), parsed.sessionId)
}
