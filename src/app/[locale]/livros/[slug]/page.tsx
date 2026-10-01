import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { isValidLocale, routing } from '@/lib/i18n/routing'
import { getBookBySlug, listBooks } from '@/modules/catalog/application'
import { coverFor } from '@/modules/catalog/domain'
import { BookCover } from '@/modules/catalog/ui'
import { buildAlternates } from '@/shared/seo/alternates'
import { absoluteUrl, assetUrl } from '@/shared/seo/site-url'

export function generateStaticParams() {
  return routing.locales.flatMap((locale) =>
    listBooks().map((book) => ({ locale, slug: book.slug })),
  )
}

export async function generateMetadata({
  params,
}: PageProps<'/[locale]/livros/[slug]'>): Promise<Metadata> {
  const { locale, slug } = await params
  const book = getBookBySlug(slug)
  if (!book || !isValidLocale(locale)) return {}

  const title = `${book.title[locale]} — NerLev`
  const description = book.subtitle[locale]

  return {
    title,
    description,
    alternates: buildAlternates(locale, `/livros/${slug}`),
    openGraph: {
      title,
      description,
      locale,
      type: 'website',
      images: [assetUrl(coverFor(book, locale).src)],
    },
  }
}

export default async function BookPage({ params }: PageProps<'/[locale]/livros/[slug]'>) {
  const { locale, slug } = await params
  if (!isValidLocale(locale)) notFound()
  setRequestLocale(locale)

  const book = getBookBySlug(slug)
  if (!book) notFound()

  const t = await getTranslations('home')

  // Schema.org Book (spec §36) — only fields backed by real data in the catalog domain,
  // no invented isbn/rating/etc.
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Book',
    name: book.title[locale],
    description: book.subtitle[locale],
    author: { '@type': 'Person', name: book.author },
    image: assetUrl(coverFor(book, locale).src),
    url: absoluteUrl(locale, `/livros/${book.slug}`),
    inLanguage: locale,
  }

  return (
    <main className="mx-auto flex max-w-3xl flex-1 flex-col items-center gap-8 px-6 py-16 text-center">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="w-64 sm:w-80">
        <BookCover book={book} locale={locale} alt={book.title[locale]} priority />
      </div>
      <div>
        <h1 className="font-display text-deep-blue text-3xl font-semibold">{book.title[locale]}</h1>
        <p className="text-warm-gray mt-1 text-lg">{book.subtitle[locale]}</p>
        <p className="text-ink mt-4">{book.author}</p>
      </div>
      <a
        href={`/r/${book.code.toLowerCase()}/amazon?lang=${locale}`}
        className="bg-deep-blue text-soft-white rounded-full px-8 py-3 text-base font-medium transition-opacity hover:opacity-90"
      >
        {t('ctaAmazon')}
      </a>
    </main>
  )
}
