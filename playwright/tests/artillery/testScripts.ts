import { expect } from '../../fixtures/fixtures'
import type { Page } from '@playwright/test'
import { HomePage } from '../../page-objects/homePage'
import { CountryDetector } from '../../page-objects/components/countryDetector'
import { ProductListingPage } from '../../page-objects/productListingPage'

export async function openHomepage(page: Page) {
  const homePage = new HomePage(page)
  const countryDetector = new CountryDetector(page)
  await homePage.visitPage()
  await page.waitForLoadState('domcontentloaded')
  await countryDetector.closeModal()
  await homePage.homepageMainContent.waitFor()
  await expect(homePage.homepageContent).toBeVisible()
}

export async function openPlp(page: Page) {
  const plp = new ProductListingPage(page)
  const countryDetector = new CountryDetector(page)
  await page.goto('/c/frauen-50337')
  await page.waitForLoadState('domcontentloaded')
  await countryDetector.closeModal()
  await plp.productCard.first().waitFor()
  await expect(plp.productCard.first()).toBeVisible()
}
