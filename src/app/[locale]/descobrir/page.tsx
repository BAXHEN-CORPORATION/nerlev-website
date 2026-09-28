import type { Metadata } from 'next'
import { headers } from 'next/headers'
import { notFound } from 'next/navigation'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { isValidLocale } from '@/lib/i18n/routing'
import { parseAttribution } from '@/shared/attribution/parse-attribution'
import { QuizFlow } from '@/modules/quiz/ui'
import { buildAlternates } from '@/shared/seo/alternates'

export async function generateMetadata({
  params,
}: PageProps<'/[locale]/descobrir'>): Promise<Metadata> {
  const { locale } = await params
  if (!isValidLocale(locale)) return {}
  const t = await getTranslations({ locale, namespace: 'home' })
  const title = `NerLev — ${t('ctaQuiz')}`

  return {
    title,
    alternates: buildAlternates(locale, '/descobrir'),
    openGraph: { title, locale, type: 'website' },
  }
}

export default async function DiscoverPage({
  params,
  searchParams,
}: PageProps<'/[locale]/descobrir'>) {
  const { locale } = await params
  if (!isValidLocale(locale)) notFound()
  setRequestLocale(locale)

  const sp = await searchParams
  const headerList = await headers()
  // spec §25: UTMs arrive on the landing URL (Reels/Shorts → CTA → /descobrir) and get
  // attached to the quiz session for attribution. Referer is the browser's own header
  // (single 'r' — that's the actual HTTP header name), not a typo.
  const attribution = parseAttribution(sp, headerList.get('referer'))

  return (
    <main className="flex flex-1 flex-col items-center justify-center px-6 py-16">
      <QuizFlow locale={locale} attribution={attribution} />
    </main>
  )
}
