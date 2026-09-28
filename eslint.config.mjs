import { defineConfig, globalIgnores } from 'eslint/config'
import coreWebVitals from 'eslint-config-next/core-web-vitals'
import nextTypescript from 'eslint-config-next/typescript'

export default defineConfig([
  globalIgnores([
    '.next/**',
    'out/**',
    'next-env.d.ts',
    'supabase/**',
    'brandkit/**',
    'test-results/**',
    'playwright-report/**',
  ]),
  ...coreWebVitals,
  ...nextTypescript,
])
