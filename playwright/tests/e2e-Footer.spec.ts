import { expect, test } from '../fixtures/fixtures'
import { FOOTER } from '../support/constants'

test.beforeEach(async ({ homePage, footer }) => {
  await homePage.visitPage()
  await footer.footerWrapper.scrollIntoViewIfNeeded()
})

test('C2141217 Verify footer shopping promises', async ({ footer }) => {
  await expect(async () => {
    await expect(footer.shoppingPromiseInvoice).toBeVisible()
    await expect(footer.shoppingPromiseShipping).toBeVisible()
    await expect(footer.shoppingPromiseReturn).toBeVisible()
  }).toPass()
})

test('C2138940 Verify footer SCAYLE section', async ({ footer }) => {
  await expect(footer.footerGroupTitle.nth(0)).toBeVisible()
  await footer.verifyFooterLinks(FOOTER.linkGroup1)
})

test('C2138941 Verify footer Help section', async ({ footer }) => {
  await expect(async () => {
    await expect(footer.footerGroupTitle.nth(1)).toBeVisible()
    await footer.verifyFooterLinks(FOOTER.linkGroup2)
  }).toPass()
})

test('C2138942 Verify footer Privacy section', async ({ footer }) => {
  await expect(async () => {
    await expect(footer.footerGroupTitle.nth(2)).toBeVisible()
    await footer.verifyFooterLinks(FOOTER.linkGroup3)
  }).toPass()
})
