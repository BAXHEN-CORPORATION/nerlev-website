'use client'

import { useReducer } from 'react'
import { useTranslations } from 'next-intl'
import type { Locale } from '@/lib/i18n/routing'
import { useRouter } from '@/lib/i18n/routing'
import { OpenQuestionsScreen } from '@/modules/feedback/ui'
import { completeQuizSession, startQuizSession, submitQuizAnswer } from '../actions'
import { questions } from '../definitions/v1'
import { initialQuizState, quizReducer } from './quiz-state'
import { QuestionScreen } from './QuestionScreen'

export interface QuizAttribution {
  utmSource?: string
  utmMedium?: string
  utmCampaign?: string
  utmContent?: string
  referrer?: string
}

export function QuizFlow({
  locale,
  attribution,
}: {
  locale: Locale
  attribution?: QuizAttribution
}) {
  const [state, dispatch] = useReducer(quizReducer, initialQuizState)
  const t = useTranslations('quiz')
  const router = useRouter()

  async function handleStart() {
    dispatch({ type: 'START_REQUESTED' })
    try {
      const { sessionId } = await startQuizSession({ locale, ...attribution })
      dispatch({ type: 'START_SUCCEEDED', sessionId })
    } catch {
      dispatch({ type: 'FAILED', message: t('error') })
    }
  }

  async function handleAnswer(sessionId: string, questionIndex: number, optionId: string) {
    dispatch({ type: 'ANSWER_SUBMITTED' })
    const question = questions[questionIndex]
    if (!question) return

    try {
      const { nextQuestionId } = await submitQuizAnswer({
        sessionId,
        questionId: question.id,
        optionId,
      })
      dispatch({ type: 'ANSWER_SAVED', hasNext: nextQuestionId !== null })
    } catch {
      dispatch({ type: 'FAILED', message: t('error') })
    }
  }

  async function handleOpenQuestionsDone(sessionId: string) {
    dispatch({ type: 'OPEN_QUESTIONS_SUBMITTED' })
    try {
      await completeQuizSession({ sessionId })
      dispatch({ type: 'COMPLETE_SUCCEEDED' })
      router.push(`/resultado/${sessionId}`)
    } catch {
      dispatch({ type: 'FAILED', message: t('error') })
    }
  }

  if (state.status === 'idle') {
    return (
      <div className="flex flex-col items-center gap-6 text-center">
        <p className="text-ink max-w-md text-lg">{t('intro')}</p>
        <button
          type="button"
          onClick={handleStart}
          className="bg-deep-blue text-soft-white rounded-full px-8 py-3 text-base font-medium transition-opacity hover:opacity-90"
        >
          {t('start')}
        </button>
      </div>
    )
  }

  if (state.status === 'starting') {
    return <p className="text-warm-gray">{t('loading')}</p>
  }

  if (state.status === 'error') {
    return (
      <p role="alert" className="text-soft-terracotta">
        {state.message}
      </p>
    )
  }

  if (state.status === 'question' || state.status === 'saving') {
    const question = questions[state.questionIndex]
    if (!question) return null

    return (
      <div aria-live="polite" className="flex flex-col items-center gap-4">
        <p className="text-warm-gray text-sm">
          {t('progress', { current: state.questionIndex + 1, total: questions.length })}
        </p>
        <QuestionScreen
          question={question}
          locale={locale}
          disabled={state.status === 'saving'}
          onSelect={(optionId) => handleAnswer(state.sessionId, state.questionIndex, optionId)}
        />
      </div>
    )
  }

  if (state.status === 'openQuestions') {
    return (
      <OpenQuestionsScreen
        sessionId={state.sessionId}
        locale={locale}
        onDone={() => handleOpenQuestionsDone(state.sessionId)}
      />
    )
  }

  // 'completing' and 'result' both redirect to /resultado/[session] — this is a brief transition state.
  return <p className="text-warm-gray">{t('loading')}</p>
}
