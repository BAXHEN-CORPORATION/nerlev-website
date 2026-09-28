import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { isValidLocale, Link } from '@/lib/i18n/routing'
import { listBooks } from '@/modules/catalog/application'
import { BookCover } from '@/modules/catalog/ui'

export async function generateMetadata({ params }: PageProps<'/[locale]'>): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'home' })

  return {
    title: `NerLev — ${t('proposalTitle')}`,
    description: t('proposalBody'),
  }
}

export default async function Home({ params }: PageProps<'/[locale]'>) {
  const { locale } = await params
  if (!isValidLocale(locale)) notFound()
  setRequestLocale(locale)
  const t = await getTranslations('home')
  const [book] = listBooks()

  return (
    <main className="flex flex-1 flex-col items-center gap-24 px-6 py-16 sm:px-12">
      {/* 1. Proposta da coleção */}
      <section className="flex max-w-2xl flex-col items-center gap-4 text-center">
        <p className="text-warm-gold font-display text-lg italic">{t('tagline')}</p>
        <h1 className="font-display text-deep-blue text-4xl font-semibold sm:text-5xl">
          {t('proposalTitle')}
        </h1>
        <p className="text-ink text-lg">{t('proposalBody')}</p>
      </section>

      {/* 2. CTA principal — pro questionário (T2) */}
      <section className="flex max-w-xl flex-col items-center gap-4 text-center">
        <p className="text-ink text-xl">{t('ctaQuiz')}</p>
        <Link
          href="/descobrir"
          className="bg-deep-blue text-soft-white rounded-full px-8 py-3 text-base font-medium transition-opacity hover:opacity-90"
        >
          {t('ctaQuizButton')}
        </Link>
      </section>

      {book && (
        <>
          {/* 3. Apresentação do livro disponível */}
          <section className="flex flex-col items-center gap-6 text-center">
            <h2 className="font-display text-deep-blue text-2xl font-semibold">
              {t('bookSectionTitle')}
            </h2>
            <div className="w-64">
              <BookCover book={book} alt={book.title[locale]} priority />
            </div>
            <div>
              <h3 className="font-display text-deep-blue text-xl font-semibold">
                {book.title[locale]}
              </h3>
              <p className="text-warm-gray">{book.subtitle[locale]}</p>
            </div>
            {/* 5. CTA de compra na Amazon */}
            <a
              href={`/r/${book.code.toLowerCase()}/amazon`}
              className="border-deep-blue text-deep-blue rounded-full border px-8 py-3 text-base font-medium transition-colors hover:bg-white/50"
            >
              {t('ctaAmazon')}
            </a>
          </section>
        </>
      )}

      {/* 4. Filosofia editorial */}
      <section className="max-w-xl text-center">
        <h2 className="font-display text-deep-blue text-xl font-semibold">
          {t('philosophyTitle')}
        </h2>
        <p className="text-ink mt-2">{t('philosophyBody')}</p>
      </section>

      {/* 6. Novos livros em desenvolvimento */}
      <p className="text-warm-gray text-sm">{t('comingSoon')}</p>
    </main>
  )
}
