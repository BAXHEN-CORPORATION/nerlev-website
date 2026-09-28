'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import type { Locale } from '@/lib/i18n/routing'
import { submitQuizOpenFeedback } from '../actions'

export function OpenQuestionsScreen({
  sessionId,
  locale,
  onDone,
}: {
  sessionId: string
  locale: Locale
  onDone: () => void
}) {
  const t = useTranslations('quiz.openQuestions')
  const [consented, setConsented] = useState(false)
  const [challengeText, setChallengeText] = useState('')
  const [growthText, setGrowthText] = useState('')
  const [submitting, setSubmitting] = useState(false)

  async function handleContinue() {
    setSubmitting(true)
    try {
      await submitQuizOpenFeedback({
        sessionId,
        locale,
        consented,
        entries: [
          { feedbackType: 'current_challenge', text: challengeText },
          { feedbackType: 'desired_growth', text: growthText },
        ],
      })
    } finally {
      onDone()
    }
  }

  return (
    <div className="flex w-full max-w-md flex-col gap-4 text-left">
      <h2 className="font-display text-deep-blue text-center text-xl font-semibold">
        {t('title')}
      </h2>

      <label className="flex items-start gap-2 text-sm">
        <input
          type="checkbox"
          checked={consented}
          onChange={(e) => setConsented(e.target.checked)}
          className="mt-1"
        />
        <span className="text-ink">{t('consentLabel')}</span>
      </label>

      <div className={consented ? 'flex flex-col gap-3' : 'flex flex-col gap-3 opacity-50'}>
        <p className="text-warm-gray text-xs">{t('privacyNotice')}</p>

        <div>
          <label htmlFor="feedback-challenge" className="text-ink text-sm font-medium">
            {t('question1')}
          </label>
          <textarea
            id="feedback-challenge"
            disabled={!consented}
            value={challengeText}
            onChange={(e) => setChallengeText(e.target.value)}
            rows={3}
            className="border-deep-blue/20 mt-1 w-full rounded-xl border bg-white/60 p-3 disabled:cursor-not-allowed"
          />
        </div>

        <div>
          <label htmlFor="feedback-growth" className="text-ink text-sm font-medium">
            {t('question2')}
          </label>
          <textarea
            id="feedback-growth"
            disabled={!consented}
            value={growthText}
            onChange={(e) => setGrowthText(e.target.value)}
            rows={3}
            className="border-deep-blue/20 mt-1 w-full rounded-xl border bg-white/60 p-3 disabled:cursor-not-allowed"
          />
        </div>
      </div>

      <button
        type="button"
        disabled={submitting}
        onClick={handleContinue}
        className="bg-deep-blue text-soft-white self-center rounded-full px-8 py-3 text-base font-medium transition-opacity hover:opacity-90 disabled:opacity-50"
      >
        {t('continueLabel')}
      </button>
    </div>
  )
}
