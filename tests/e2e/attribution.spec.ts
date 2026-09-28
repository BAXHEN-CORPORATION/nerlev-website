import { test, expect } from '@playwright/test'

test('/descobrir accepts UTM query params without breaking the intro screen', async ({ page }) => {
  const response = await page.goto(
    '/pt/descobrir?utm_source=youtube&utm_medium=short&utm_campaign=fear&utm_content=CUT000142',
  )
  expect(response?.status()).toBe(200)
  await expect(page.getByRole('button', { name: 'Começar' })).toBeVisible()
})

test('/r/[book]/amazon still redirects even when the click log fails (e.g. unknown session FK)', async ({
  request,
}) => {
  // session=<nil uuid> doesn't exist in quiz_sessions, so the FK insert in
  // amazon_clicks fails — logAmazonClickBestEffort swallows that and the redirect
  // must still happen. Real session-linked logging is confirmed manually against the
  // live DB (see T5 plan notes) since e2e here has no direct DB access configured.
  const response = await request.get(
    '/r/b01/amazon?session=00000000-0000-0000-0000-000000000000&utm_source=youtube',
    { maxRedirects: 0 },
  )
  expect(response.status()).toBe(302)
  expect(response.headers()['location']).toBe('https://www.amazon.es/dp/B0HKYZ1LHN')
})
