'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import type { Locale } from '@/lib/i18n/routing'
import { captureQuizLead } from '../actions'

export function LeadCaptureForm({
  sessionId,
  locale,
  hasBook,
}: {
  sessionId: string
  locale: Locale
  hasBook: boolean
}) {
  const t = useTranslations('forms.leadCapture')
  const [email, setEmail] = useState('')
  const [marketingConsent, setMarketingConsent] = useState(false)
  const [website, setWebsite] = useState('')
  const [status, setStatus] = useState<'idle' | 'submitting' | 'done' | 'error'>('idle')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setStatus('submitting')
    try {
      await captureQuizLead({ email, locale, sessionId, marketingConsent, website })
      setStatus('done')
    } catch {
      setStatus('error')
    }
  }

  if (status === 'done') {
    return <p className="text-ink text-sm">{t('successMessage')}</p>
  }

  return (
    <form onSubmit={handleSubmit} className="flex w-full max-w-sm flex-col gap-3 text-left">
      <p className="text-ink text-sm">{hasBook ? t('promptWithBook') : t('promptWithoutBook')}</p>

      {/* Honeypot — hidden from real users (off-screen, unreachable by tab), bots that
          autofill every input tend to fill this one too (spec §29 anti-spam). */}
      <input
        type="text"
        name="website"
        value={website}
        onChange={(e) => setWebsite(e.target.value)}
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        className="absolute left-[-9999px] h-0 w-0 overflow-hidden"
      />

      <input
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder={t('emailPlaceholder')}
        aria-label={t('emailLabel')}
        className="border-deep-blue/20 rounded-xl border bg-white/60 p-3 text-sm"
      />

      <label className="flex items-start gap-2 text-xs">
        <input
          type="checkbox"
          checked={marketingConsent}
          onChange={(e) => setMarketingConsent(e.target.checked)}
          className="mt-0.5"
        />
        <span className="text-warm-gray">{t('marketingConsentLabel')}</span>
      </label>

      {status === 'error' && (
        <p role="alert" className="text-soft-terracotta text-xs">
          {t('error')}
        </p>
      )}

      <button
        type="submit"
        disabled={status === 'submitting'}
        className="bg-deep-blue text-soft-white self-start rounded-full px-6 py-2 text-sm font-medium transition-opacity hover:opacity-90 disabled:opacity-50"
      >
        {hasBook ? t('submitLabel') : t('waitlistSubmitLabel')}
      </button>
    </form>
  )
}
