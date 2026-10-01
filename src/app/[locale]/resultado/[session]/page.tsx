import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { isValidLocale } from '@/lib/i18n/routing'
import { getQuizResult } from '@/modules/quiz/actions'
import { getThemeById } from '@/modules/quiz/definitions/v1'
import { listBooks } from '@/modules/catalog/application'
import { BookCover } from '@/modules/catalog/ui'
import { LeadCaptureForm } from '@/modules/leads/ui'

// spec §36: resultados do quiz nunca aparecem em busca — dado pessoal do pai, não conteúdo público.
export const metadata: Metadata = {
  robots: { index: false, follow: false },
}

export default async function ResultPage({ params }: PageProps<'/[locale]/resultado/[session]'>) {
  const { locale, session } = await params
  if (!isValidLocale(locale)) notFound()
  setRequestLocale(locale)

  const t = await getTranslations('results')
  const result = await getQuizResult({ sessionId: session })

  if (!result || !result.primaryThemeId) {
    return (
      <main className="flex flex-1 flex-col items-center justify-center gap-2 px-6 py-16 text-center">
        <h1 className="font-display text-deep-blue text-2xl font-semibold">{t('notFoundTitle')}</h1>
        <p className="text-warm-gray">{t('notFoundBody')}</p>
      </main>
    )
  }

  const primaryTheme = getThemeById(result.primaryThemeId)
  const secondaryTheme = result.secondaryThemeId ? getThemeById(result.secondaryThemeId) : null
  const book = listBooks().find((b) => b.canonicalTheme === result.primaryThemeId)

  if (!primaryTheme) notFound()

  return (
    <main className="mx-auto flex max-w-2xl flex-1 flex-col items-center gap-10 px-6 py-16 text-center">
      <div>
        <p className="text-warm-gray text-sm">{t('title')}</p>
        <h1 className="font-display text-deep-blue mt-2 text-3xl font-semibold">
          {primaryTheme.label[locale]}
        </h1>
        {secondaryTheme && (
          <p className="text-warm-gray mt-1">
            {t('secondaryLabel')}: {secondaryTheme.label[locale]}
          </p>
        )}
        <p className="text-ink mt-4">{primaryTheme.explanation[locale]}</p>
      </div>

      <div className="w-full text-left">
        <h2 className="font-display text-deep-blue text-xl font-semibold">{t('tipsTitle')}</h2>
        <ul className="text-ink mt-3 flex flex-col gap-2">
          {primaryTheme.tips.map((tip, index) => (
            <li key={index} className="border-warm-gray/30 border-l-2 pl-3">
              {tip[locale]}
            </li>
          ))}
        </ul>
      </div>

      {book ? (
        <div className="flex flex-col items-center gap-4">
          <div className="w-56">
            <BookCover book={book} locale={locale} alt={book.title[locale]} />
          </div>
          <a
            href={`/r/${book.code.toLowerCase()}/amazon?session=${session}&lang=${locale}`}
            className="bg-deep-blue text-soft-white rounded-full px-8 py-3 text-base font-medium transition-opacity hover:opacity-90"
          >
            {t('bookCta')}
          </a>
        </div>
      ) : (
        <p className="text-warm-gray">{t('bookComingSoon')}</p>
      )}

      <LeadCaptureForm sessionId={session} locale={locale} hasBook={!!book} />
    </main>
  )
}
