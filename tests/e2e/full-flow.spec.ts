import { test, expect } from '@playwright/test'

// spec §37: the full diagram (Home → Quiz → Perguntas → Feedback → Resultado → Email →
// Amazon) tested in all 3 locales. Edge cases (unknown session, consent granted with
// text filled in, invalid FK, etc.) stay PT-only in their own spec files — this one only
// covers the main path, parametrized.

const labels = {
  pt: {
    ctaQuizButton: 'Fazer o questionário',
    start: 'Começar',
    continueLabel: 'Continuar',
    send: 'Enviar',
    success: 'Prontinho! Fique de olho na sua caixa de entrada.',
    amazonCta: 'Conhecer na Amazon',
  },
  en: {
    ctaQuizButton: 'Take the quiz',
    start: 'Start',
    continueLabel: 'Continue',
    send: 'Send',
    success: 'All set! Keep an eye on your inbox.',
    amazonCta: 'Find it on Amazon',
  },
  es: {
    ctaQuizButton: 'Hacer el cuestionario',
    start: 'Comenzar',
    continueLabel: 'Continuar',
    send: 'Enviar',
    success: '¡Listo! Revisa tu bandeja de entrada.',
    amazonCta: 'Conócelo en Amazon',
  },
} as const

for (const locale of ['pt', 'en', 'es'] as const) {
  test(`full flow — Home→Quiz→Perguntas→Feedback→Resultado→Email→Amazon (${locale})`, async ({
    page,
  }) => {
    const t = labels[locale]

    await page.goto(`/${locale}`)
    await page.getByRole('link', { name: t.ctaQuizButton }).click()
    await page.waitForURL(new RegExp(`/${locale}/descobrir$`))

    await page.getByRole('button', { name: t.start }).click()

    for (let i = 0; i < 7; i++) {
      await page.waitForFunction(() => document.querySelectorAll('main button').length > 0)
      await page.locator('main button').first().click()
    }

    // Feedback screen (T3) — decline consent, same path as feedback.spec.ts's second test.
    await page.getByRole('button', { name: t.continueLabel }).click()

    await page.waitForURL(/\/resultado\//)
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible()

    await page.locator('input[type=email]').fill(`e2e-${locale}-${Date.now()}@example.com`)
    await page.getByRole('button', { name: t.send }).click()
    await expect(page.getByText(t.success)).toBeVisible({ timeout: 10_000 })

    await expect(page.getByRole('link', { name: t.amazonCta })).toHaveAttribute(
      'href',
      /^\/r\/b01\/amazon\?session=[0-9a-f-]+$/,
    )
  })
}
