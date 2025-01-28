import type { Locator, Page } from '@playwright/test'
import { expect } from '../../fixtures/fixtures'

export class ShopSelector {
  readonly page: Page
  readonly shopSelectorListbox: Locator
  readonly globeIcon: Locator
  readonly iconChevron: Locator
  readonly currentShop: Locator
  readonly shopLanguageItem: Locator
  readonly shopLanguageItemCurrent: Locator
  readonly shopSelectorList: Locator
  readonly currentShopMobile: Locator
  readonly currentCountry: Locator
  readonly country: Locator

  constructor(page: Page) {
    this.page = page
    this.shopSelectorListbox = page.getByTestId('language-listbox')
    this.globeIcon = page.getByTestId('shop-switcher-globe-icon')
    this.iconChevron = page.getByTestId('shop-icon-chevron')
    this.currentShop = page.getByTestId('shop-switcher-current-shop')
    this.shopLanguageItem = page.getByTestId('shop-language-item')
    this.shopLanguageItemCurrent = page.getByTestId(
      'shop-language-item-current',
    )
    this.shopSelectorList = page.getByTestId('shop-selector-list')
    this.currentShopMobile = page.getByTestId(
      'shop-switcher-current-shop-mobile',
    )
    this.currentCountry = page.getByTestId('shop-selector-current-country')
    this.country = page.getByTestId('shop-selector-country')
  }

  async assertShopSelectorIsVisible(index: number) {
    await this.shopSelectorListbox.nth(index).waitFor()
    await expect(this.globeIcon.nth(index)).toBeVisible()
    await expect(this.shopSelectorListbox.nth(index)).toBeVisible()
    await expect(this.shopSelectorListbox.nth(index)).toHaveAttribute(
      'aria-expanded',
      'false',
    )
  }

  async openShopSelector(index: number) {
    await this.shopSelectorListbox.nth(index).click()
    await this.page.waitForLoadState('domcontentloaded')
    await this.currentCountry.waitFor()
  }

  async switchShop() {
    const pageUrlInitial = this.page.url()
    const switchedShopLabel = await this.country.first().textContent()
    await this.page.waitForTimeout(500)
    await this.country.first().click({ force: true })

    await this.page.waitForLoadState('domcontentloaded')
    await this.page.waitForTimeout(500)
    const newShopElement = this.page.locator(`text="${switchedShopLabel}"`)
    expect(await newShopElement.textContent()).toEqual(switchedShopLabel)

    const pageUrlSwitched = this.page.url()
    expect(pageUrlInitial).not.toEqual(pageUrlSwitched)
  }

  async switchShopToCurrent(index: number) {
    const pageUrlInitial = this.page.url()
    const switchedShopLabel = await this.currentCountry.first().textContent()
    await this.page.waitForTimeout(500)
    await this.currentCountry.first().click({ force: true })
    await this.page.waitForLoadState('domcontentloaded')
    await this.page.waitForTimeout(500)
    const pageUrlSwitched = this.page.url()
    expect(await this.shopSelectorListbox.nth(index).textContent()).toContain(
      switchedShopLabel,
    )
    expect(pageUrlInitial).toEqual(pageUrlSwitched)
  }
}
