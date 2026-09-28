import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { isValidLocale } from '@/lib/i18n/routing'
import { QuizFlow } from '@/modules/quiz/ui'

export async function generateMetadata({
  params,
}: PageProps<'/[locale]/descobrir'>): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'home' })

  return { title: `NerLev — ${t('ctaQuiz')}` }
}

export default async function DiscoverPage({ params }: PageProps<'/[locale]/descobrir'>) {
  const { locale } = await params
  if (!isValidLocale(locale)) notFound()
  setRequestLocale(locale)

  return (
    <main className="flex flex-1 flex-col items-center justify-center px-6 py-16">
      <QuizFlow locale={locale} />
    </main>
  )
}
