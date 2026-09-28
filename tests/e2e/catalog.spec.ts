import { test, expect } from '@playwright/test'

const bookTitleByLocale = {
  pt: 'Quando tenho medo',
  en: "When I'm Afraid",
  es: 'Cuando tengo miedo',
} as const

for (const [locale, title] of Object.entries(bookTitleByLocale)) {
  test(`/livros lists the book in ${locale}`, async ({ page }) => {
    const response = await page.goto(`/${locale}/livros`)
    expect(response?.status()).toBe(200)
    await expect(page.getByRole('link', { name: new RegExp(title) })).toBeVisible()
  })

  test(`/livros/[slug] shows the book detail in ${locale}`, async ({ page }) => {
    const response = await page.goto(`/${locale}/livros/when-i-am-afraid-davi`)
    expect(response?.status()).toBe(200)
    await expect(page.getByRole('heading', { name: title, level: 1 })).toBeVisible()
    await expect(page.getByRole('link', { name: /amazon/i })).toHaveAttribute(
      'href',
      '/r/b01/amazon',
    )
  })
}

test('/livros/[slug] 404s for an unknown slug', async ({ page }) => {
  const response = await page.goto('/pt/livros/does-not-exist')
  expect(response?.status()).toBe(404)
})

test('/r/b01/amazon redirects to the real Amazon listing', async ({ request }) => {
  const response = await request.get('/r/b01/amazon', { maxRedirects: 0 })
  expect(response.status()).toBe(302)
  expect(response.headers()['location']).toBe('https://www.amazon.es/dp/B0HKYZ1LHN')
})

test('/r/[book]/amazon 404s for an unknown book', async ({ request }) => {
  const response = await request.get('/r/xx/amazon', { maxRedirects: 0 })
  expect(response.status()).toBe(404)
})
