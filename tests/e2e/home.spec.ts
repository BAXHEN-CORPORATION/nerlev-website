import { test, expect } from '@playwright/test'

const locales = ['pt', 'en', 'es'] as const

for (const locale of locales) {
  test(`home renders in ${locale}`, async ({ page }) => {
    const response = await page.goto(`/${locale}`)
    expect(response?.status()).toBe(200)
    await expect(page.locator('html')).toHaveAttribute('lang', locale)
    await expect(
      page.getByRole('heading', { name: 'Meu Coração Diante de Deus', level: 1 }),
    ).toBeVisible()
  })
}

test('root redirects to a supported locale', async ({ page }) => {
  // next-intl negotiates the locale from Accept-Language, so the exact match
  // depends on the browser's locale — what matters is that proxy.ts actually
  // rewrites '/' into one of our three supported, prefixed locales.
  await page.goto('/')
  await expect(page).toHaveURL(/\/(pt|en|es)$/)
})
