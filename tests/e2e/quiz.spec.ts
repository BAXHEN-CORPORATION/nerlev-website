import { test, expect } from '@playwright/test'

test('completing the quiz picking the first option each time lands on a fear result with the B01 recommendation', async ({
  page,
}) => {
  await page.goto('/pt/descobrir')
  await page.getByRole('button', { name: 'Começar' }).click()

  for (let i = 0; i < 7; i++) {
    await page.waitForFunction(() => document.querySelectorAll('main button').length > 0)
    await page.locator('main button').first().click()
  }

  // Open-feedback step (T3) — decline and continue, covered on its own in feedback.spec.ts.
  await page.getByRole('button', { name: 'Continuar' }).click()

  await page.waitForURL(/\/resultado\//)
  await expect(page.getByRole('heading', { name: 'Medo', level: 1 })).toBeVisible()
  await expect(page.getByText('Tema secundário')).toBeVisible()
  // ?session=<id> is appended (T5, spec §67) so the click can be attributed back to
  // this quiz session — see attribution.spec.ts / tests/e2e for the redirect itself.
  await expect(page.getByRole('link', { name: 'Conhecer na Amazon' })).toHaveAttribute(
    'href',
    /^\/r\/b01\/amazon\?session=[0-9a-f-]+$/,
  )
})

test('an unknown session id shows the not-found state instead of crashing', async ({ page }) => {
  const response = await page.goto('/pt/resultado/00000000-0000-0000-0000-000000000000')
  expect(response?.status()).toBe(200)
  await expect(page.getByRole('heading', { name: 'Resultado não encontrado' })).toBeVisible()
})

test('/descobrir renders the intro screen in all three locales', async ({ page }) => {
  for (const locale of ['pt', 'en', 'es']) {
    const response = await page.goto(`/${locale}/descobrir`)
    expect(response?.status()).toBe(200)
  }
})
