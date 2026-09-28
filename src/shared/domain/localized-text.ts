import type { Locale } from '@/lib/i18n/routing'

/** Text that must exist in every supported locale — never partial. */
export type LocalizedText = Record<Locale, string>
