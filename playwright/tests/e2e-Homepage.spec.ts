import { expect, test } from '../fixtures/fixtures'
import { getAllLinksFromPage } from '../support/utils'

test('C2141227 Verify Homepage sections', async ({
  homePage,
  header,
  footer,
}) => {
  await homePage.visitPage()
  await expect(async () => {
    await homePage.homepageContent.waitFor()
    await expect(header.mainHeader).toBeVisible()
    await expect(footer.footerWrapper).toBeVisible()
  }).toPass()
})

test('C2141228 Verify Homepage links', async ({ homePage, page }) => {
  await homePage.visitPage()
  const linkUrls = await getAllLinksFromPage(page)

  for (const url of linkUrls) {
    await test.step(`Checking link: ${url}`, async () => {
      const response = await page.request.get(url)
      expect.soft(response.ok(), `${url} has invalid status code`).toBeTruthy()
    })
  }
})
