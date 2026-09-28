import { readFileSync, readdirSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
export const MESSAGES_DIR = path.resolve(__dirname, '../src/lib/i18n/messages')

type Messages = Record<string, unknown>

function flattenKeys(obj: Messages, prefix = ''): string[] {
  return Object.entries(obj).flatMap(([key, value]) => {
    const path = prefix ? `${prefix}.${key}` : key
    if (value && typeof value === 'object' && !Array.isArray(value)) {
      return flattenKeys(value as Messages, path)
    }
    return [path]
  })
}

export interface Mismatch {
  locale: string
  missing: string[]
  extra: string[]
}

/** Compares the key sets of every locale's message file against the union of all keys. */
export function findMismatches(messagesDir: string = MESSAGES_DIR): Mismatch[] {
  const files = readdirSync(messagesDir).filter((f) => f.endsWith('.json'))
  const perLocale = new Map<string, Set<string>>()

  for (const file of files) {
    const locale = file.replace(/\.json$/, '')
    const content = JSON.parse(readFileSync(path.join(messagesDir, file), 'utf-8')) as Messages
    perLocale.set(locale, new Set(flattenKeys(content)))
  }

  const allKeys = new Set<string>()
  for (const keys of perLocale.values()) {
    for (const key of keys) allKeys.add(key)
  }

  const mismatches: Mismatch[] = []
  for (const [locale, keys] of perLocale) {
    const missing = [...allKeys].filter((k) => !keys.has(k))
    const extra = [...keys].filter((k) => !allKeys.has(k))
    if (missing.length > 0 || extra.length > 0) {
      mismatches.push({ locale, missing, extra })
    }
  }

  return mismatches
}

function isMainModule() {
  return process.argv[1] === fileURLToPath(import.meta.url)
}

if (isMainModule()) {
  const mismatches = findMismatches()
  if (mismatches.length === 0) {
    console.log('translations: all locales have matching keys')
    process.exit(0)
  }

  console.error('translations: key mismatch between locales')
  for (const { locale, missing, extra } of mismatches) {
    if (missing.length > 0) console.error(`  [${locale}] missing: ${missing.join(', ')}`)
    if (extra.length > 0) console.error(`  [${locale}] extra: ${extra.join(', ')}`)
  }
  process.exit(1)
}
