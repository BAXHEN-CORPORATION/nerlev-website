import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { isValidLocale } from '@/lib/i18n/routing'
import { listBooks } from '@/modules/catalog/application'
import { BookCard } from '@/modules/catalog/ui'
import { buildAlternates } from '@/shared/seo/alternates'

export async function generateMetadata({
  params,
}: PageProps<'/[locale]/livros'>): Promise<Metadata> {
  const { locale } = await params
  if (!isValidLocale(locale)) return {}
  const t = await getTranslations({ locale, namespace: 'navigation' })
  const title = `NerLev — ${t('books')}`

  return {
    title,
    alternates: buildAlternates(locale, '/livros'),
    openGraph: { title, locale, type: 'website' },
  }
}

export default async function BooksPage({ params }: PageProps<'/[locale]/livros'>) {
  const { locale } = await params
  if (!isValidLocale(locale)) notFound()
  setRequestLocale(locale)
  const t = await getTranslations('navigation')
  const books = listBooks()

  return (
    <main className="flex flex-1 flex-col items-center gap-12 px-6 py-16">
      <h1 className="font-display text-deep-blue text-3xl font-semibold">{t('books')}</h1>
      <div className="flex flex-wrap justify-center gap-12">
        {books.map((book) => (
          <BookCard key={book.id} book={book} locale={locale} />
        ))}
      </div>
    </main>
  )
}
