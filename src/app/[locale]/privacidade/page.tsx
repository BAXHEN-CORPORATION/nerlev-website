import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { isValidLocale } from '@/lib/i18n/routing'
import { buildAlternates } from '@/shared/seo/alternates'

export async function generateMetadata({
  params,
}: PageProps<'/[locale]/privacidade'>): Promise<Metadata> {
  const { locale } = await params
  if (!isValidLocale(locale)) return {}
  const t = await getTranslations({ locale, namespace: 'privacy' })

  return {
    title: `${t('title')} — NerLev`,
    alternates: buildAlternates(locale, '/privacidade'),
  }
}

export default async function PrivacyPage({ params }: PageProps<'/[locale]/privacidade'>) {
  const { locale } = await params
  if (!isValidLocale(locale)) notFound()
  setRequestLocale(locale)

  const t = await getTranslations('privacy')
  const neverCollect = t.raw('neverCollect') as string[]
  const collect = t.raw('collect') as string[]
  const security = t.raw('security') as string[]

  return (
    <main className="mx-auto flex max-w-2xl flex-1 flex-col gap-8 px-6 py-16">
      <div>
        <h1 className="font-display text-deep-blue text-3xl font-semibold">{t('title')}</h1>
        <p className="text-warm-gray mt-1 text-sm">{t('updated')}</p>
      </div>

      <p role="note" className="border-warm-gold/40 bg-warm-gold/10 rounded-xl border p-4 text-sm">
        {t('draftNotice')}
      </p>

      <p className="text-ink">{t('intro')}</p>

      <section>
        <h2 className="font-display text-deep-blue text-xl font-semibold">
          {t('neverCollectTitle')}
        </h2>
        <ul className="text-ink mt-2 list-disc space-y-1 pl-5">
          {neverCollect.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </section>

      <section>
        <h2 className="font-display text-deep-blue text-xl font-semibold">{t('collectTitle')}</h2>
        <ul className="text-ink mt-2 list-disc space-y-1 pl-5">
          {collect.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </section>

      <section>
        <h2 className="font-display text-deep-blue text-xl font-semibold">{t('consentTitle')}</h2>
        <p className="text-ink mt-2">{t('consentResearch')}</p>
        <p className="text-ink mt-2">{t('consentMarketing')}</p>
      </section>

      <section>
        <h2 className="font-display text-deep-blue text-xl font-semibold">
          {t('providersTitle')}
        </h2>
        <p className="text-ink mt-2">{t('providersIntro')}</p>
        <ul className="text-ink mt-2 list-disc space-y-1 pl-5">
          <li>{t('providerSupabase')}</li>
          <li>{t('providerResend')}</li>
          <li>{t('providerPostHog')}</li>
        </ul>
      </section>

      <section>
        <h2 className="font-display text-deep-blue text-xl font-semibold">{t('securityTitle')}</h2>
        <ul className="text-ink mt-2 list-disc space-y-1 pl-5">
          {security.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </section>

      <section>
        <h2 className="font-display text-deep-blue text-xl font-semibold">{t('contactTitle')}</h2>
        <p className="text-ink mt-2">{t('contactBody')}</p>
      </section>
    </main>
  )
}
