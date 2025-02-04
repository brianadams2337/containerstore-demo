import { expect, test } from '../fixtures/fixtures'
import { HOMEPAGE_PATH_DE, HOMEPAGE_PATH_EN } from '../support/constants'

test.beforeEach(async ({ page, baseURL }) => {
  await expect(async () => {
    const pageUrl = `${baseURL}/en`
    await page.goto(pageUrl, { waitUntil: 'load' })
  }).toPass()
})

test.describe('Test from Berlin against US shop', () => {
  test.use({
    timezoneId: 'Europe/Berlin',
  })

  test('C2141736: Verify Country Detector close button', async ({
    countryDetector,
  }) => {
    await countryDetector.closeButton.waitFor()
    await expect(async () => {
      await countryDetector.closeModal()
    }).toPass()
  })

  test('C2141737: Verify Country Detector switch shop', async ({
    countryDetector,
    page,
  }) => {
    await expect(async () => {
      await countryDetector.switchShopButton.first().waitFor()
      await countryDetector.switchShopButton.first().click()
      await page.waitForLoadState('networkidle')
      await page.waitForTimeout(500)
      const pageUrl = page.url()
      expect(pageUrl).toContain(HOMEPAGE_PATH_DE)
      await expect(countryDetector.switchShopButton).not.toBeVisible()
    }).toPass()
  })

  test('C2141738: Verify Country Detector stay in the shop', async ({
    countryDetector,
    page,
  }) => {
    await expect(async () => {
      await countryDetector.stayInShopButton.waitFor()
      await countryDetector.stayInShopButton.click()

      const pageUrl = page.url()
      expect(pageUrl).toContain(HOMEPAGE_PATH_EN)
      await expect(countryDetector.stayInShopButton).not.toBeVisible()
    }).toPass()
  })
})
