import { expect, test } from '../fixtures/fixtures'
import { FOOTER, HOMEPAGE_PATH_DE } from '../support/constants'

test.beforeEach(async ({ homePage, footer }) => {
  await homePage.visitPage()
  await footer.footerWrapper.scrollIntoViewIfNeeded()
})

test('C2138940 Verify footer About us section', async ({ footer }) => {
  await expect(async () => {
    await expect(footer.footerLinkSection.nth(0)).toBeVisible()
    await expect(footer.footerLinkSectionTitle.nth(0)).toBeVisible()
    await footer.verifyFooterLinks(FOOTER.linkGroup1)
  }).toPass()
})

test('C2138941 Verify footer Help and Support section', async ({ footer }) => {
  await expect(async () => {
    await expect(footer.footerLinkSection.nth(1)).toBeVisible()
    await expect(footer.footerLinkSectionTitle.nth(1)).toBeVisible()
    await footer.verifyFooterLinks(FOOTER.linkGroup2)
  }).toPass()
})

test('C2138942 Verify footer Privacy section', async ({ footer }) => {
  await expect(async () => {
    await expect(footer.footerLinkSection.nth(2)).toBeVisible()
    await expect(footer.footerLinkSectionTitle.nth(2)).toBeVisible()
    await footer.verifyFooterLinks(FOOTER.linkGroup3)
  }).toPass()
})

test('C2143604 Verify footer Social section', async ({ footer }) => {
  await expect(async () => {
    await expect(footer.footerLinkSection.nth(3)).toBeVisible()
    await expect(footer.footerLinkSectionTitle.nth(3)).toBeVisible()
    await footer.verifyFooterLinks(FOOTER.linkGroup4)
  }).toPass()
})

test('C2143605 Verify footer logo', async ({
  footer,
  page,
  baseURL,
  header,
}) => {
  await test.step('Verify logo click from Homepage', async () => {
    await expect(async () => {
      await expect(footer.footerLogo).toBeVisible()
      const pageUrl = page.url()
      await footer.footerLogo.click()
      expect(page.url()).toEqual(pageUrl)
      await page.waitForTimeout(1000)
      await expect(header.mainHeader).toBeInViewport()
      const scrollPosition = await page.evaluate(() => window.scrollY)
      expect(scrollPosition).toBe(0)
    }).toPass()
  })
  await test.step('Verify logo click from non-Homepage', async () => {
    await expect(async () => {
      await page.goto(FOOTER.linkGroup3.imprint, { waitUntil: 'commit' })
      await expect(footer.footerLogo).toBeVisible()
      await footer.footerLogo.click()
      await page.waitForLoadState('domcontentloaded')
      await expect(header.mainHeader).toBeInViewport()
      expect(page.url()).toEqual(baseURL + HOMEPAGE_PATH_DE)
    }).toPass()
  })
})
