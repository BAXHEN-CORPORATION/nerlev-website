import { defineRouting } from 'next-intl/routing'
import { createNavigation } from 'next-intl/navigation'

export const routing = defineRouting({
  locales: ['pt', 'en', 'es'],
  defaultLocale: 'en',
  localePrefix: 'always',
})

export const { Link, redirect, usePathname, useRouter } = createNavigation(routing)

export type Locale = (typeof routing.locales)[number]

export function isValidLocale(value: string): value is Locale {
  return (routing.locales as readonly string[]).includes(value)
}
