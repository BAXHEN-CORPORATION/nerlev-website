import type { Metadata } from 'next'
import { Fraunces, Inter } from 'next/font/google'
import { NextIntlClientProvider } from 'next-intl'
import { getMessages, getTranslations, setRequestLocale } from 'next-intl/server'
import { notFound } from 'next/navigation'
import { isValidLocale, Link, routing } from '@/lib/i18n/routing'
import { PostHogProvider } from '@/modules/analytics/ui'
import { siteUrl } from '@/shared/seo/site-url'
import '../globals.css'

const fraunces = Fraunces({
  variable: '--font-display',
  subsets: ['latin'],
})

const inter = Inter({
  variable: '--font-body',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl()),
  title: 'NerLev',
  description: 'Light for growing hearts.',
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

export default async function RootLayout({ children, params }: LayoutProps<'/[locale]'>) {
  const { locale } = await params

  if (!isValidLocale(locale)) {
    notFound()
  }

  setRequestLocale(locale)
  const messages = await getMessages()
  const t = await getTranslations({ locale, namespace: 'navigation' })

  return (
    <html lang={locale} className={`${fraunces.variable} ${inter.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        <NextIntlClientProvider messages={messages}>
          <PostHogProvider>{children}</PostHogProvider>
          <footer className="mt-auto px-6 py-6 text-center">
            <Link href="/privacidade" className="text-warm-gray text-xs underline">
              {t('privacy')}
            </Link>
          </footer>
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
