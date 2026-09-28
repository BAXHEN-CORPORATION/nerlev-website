import 'server-only'
import { Resend } from 'resend'
import { getTranslations } from 'next-intl/server'
import { serverEnv } from '@/shared/infrastructure/env/env.server'
import type { EmailSender, QuizResultSummary } from '../application/email-sender'
import { QuizResultEmail } from './emails/QuizResultEmail'

// Sandbox sender — no verified domain in Resend yet (user decision, T4 plan). Only
// delivers to the Resend account owner's own address until a domain is verified;
// any other recipient will fail to send. Swap once a domain is verified.
const FROM_ADDRESS = 'NerLev <onboarding@resend.dev>'

export function createResendEmailSender(): EmailSender {
  if (!serverEnv.RESEND_API_KEY) {
    throw new Error('Missing RESEND_API_KEY — set it in .env.local to send emails.')
  }
  const resend = new Resend(serverEnv.RESEND_API_KEY)

  return {
    async sendQuizResultEmail(to: string, locale: string, summary: QuizResultSummary) {
      const t = await getTranslations({ locale, namespace: 'results' })

      const { error } = await resend.emails.send({
        from: FROM_ADDRESS,
        to,
        subject: `${t('emailSubject')} — ${summary.themeLabel}`,
        react: QuizResultEmail({
          greeting: t('emailGreeting'),
          themeLabel: summary.themeLabel,
          tipsTitle: t('tipsTitle'),
          tips: summary.tips,
          bookTitle: summary.bookTitle,
          bookCtaLabel: summary.bookAmazonUrl ? t('bookCta') : undefined,
          bookAmazonUrl: summary.bookAmazonUrl,
          footer: t('emailFooter'),
        }),
      })

      if (error) throw new Error(`Resend send failed: ${error.message}`)
    },
  }
}
