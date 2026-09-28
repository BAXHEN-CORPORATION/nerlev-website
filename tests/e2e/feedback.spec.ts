import { test, expect } from '@playwright/test'

async function completeStructuredQuestions(page: import('@playwright/test').Page) {
  await page.goto('/pt/descobrir')
  await page.getByRole('button', { name: 'Começar' }).click()

  for (let i = 0; i < 7; i++) {
    await page.waitForFunction(() => document.querySelectorAll('main button').length > 0)
    await page.locator('main button').first().click()
  }

  await expect(page.getByText('Mais duas perguntas opcionais')).toBeVisible()
}

test('completes the quiz with open-feedback consent granted and text filled in', async ({
  page,
}) => {
  await completeStructuredQuestions(page)

  await page.locator('input[type=checkbox]').check()
  await page.locator('#feedback-challenge').fill('Situação de teste, sem identificar ninguém.')
  await page.locator('#feedback-growth').fill('Objetivo de teste dos pais.')
  await page.getByRole('button', { name: 'Continuar' }).click()

  await page.waitForURL(/\/resultado\//)
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
})

test('completes the quiz declining open-feedback consent, with textareas disabled', async ({
  page,
}) => {
  await completeStructuredQuestions(page)

  await expect(page.locator('#feedback-challenge')).toBeDisabled()
  await expect(page.locator('#feedback-growth')).toBeDisabled()

  await page.getByRole('button', { name: 'Continuar' }).click()

  await page.waitForURL(/\/resultado\//)
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
})
