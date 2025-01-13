import { test } from '../fixtures/fixtures'
import pages from '../support/pages-hydration-check.json'

test.describe('Hydration Tests', () => {
  for (const [pageName, path] of Object.entries(pages)) {
    test(`Verify hydration errors on ${pageName}`, async ({
      page,
      baseURL,
    }) => {
      page.on('console', (message) => {
        if (
          (message.type() === 'warning' || message.type() === 'error') &&
          /hydration/i.test(message.text())
        ) {
          throw new Error(`Hydration warning detected: ${message.text()}`)
        }
      })
      await page.goto(`${baseURL}${path}`, { waitUntil: 'commit' })
      await page.waitForLoadState('networkidle')
      await page.waitForLoadState('domcontentloaded')
      await page.waitForTimeout(500)
    })
  }
})
