import { test, expect } from '@playwright/test'

test('captures a lead from the result page even though sandbox email delivery fails for non-owner addresses', async ({
  page,
}) => {
  await page.goto('/pt/descobrir')
  await page.getByRole('button', { name: 'Começar' }).click()

  for (let i = 0; i < 7; i++) {
    await page.waitForFunction(() => document.querySelectorAll('main button').length > 0)
    await page.locator('main button').first().click()
  }

  await page.getByRole('button', { name: 'Continuar' }).click()
  await page.waitForURL(/\/resultado\//)

  await page.locator('input[type=email]').fill(`e2e-${Date.now()}@example.com`)
  await page.getByRole('button', { name: 'Enviar' }).click()

  // Lead is saved regardless of whether the (sandboxed) email actually delivers —
  // that's the whole point of the best-effort design (see capture-lead.spec.ts unit test).
  await expect(page.getByText('Prontinho! Fique de olho na sua caixa de entrada.')).toBeVisible({
    timeout: 10_000,
  })
})
