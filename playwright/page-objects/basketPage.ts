import type { Locator, Page } from '@playwright/test'
import { HOMEPAGE_PATH_DE } from '../support/constants'
import { expect } from '../fixtures/fixtures'
import type { RPC } from './components/rpc'

export class BasketPage {
  readonly page: Page
  readonly rpc: RPC
  readonly checkoutButton: Locator
  readonly productInBasket: Locator
  readonly productImage: Locator
  readonly basketProductCard: Locator
  readonly basketContainer: Locator
  readonly basketTitle: Locator
  readonly basketSubTitle: Locator
  readonly loginButton: Locator
  readonly continueButton: Locator
  readonly productBrand: Locator
  readonly productName: Locator
  readonly removeItemButton: Locator
  readonly confirmRemoveItemButton: Locator

  constructor(page: Page, rpc: RPC) {
    this.page = page
    this.rpc = rpc
    this.checkoutButton = page.getByTestId('checkout-link')
    this.productInBasket = page.getByTestId('basket-card')
    this.productImage = page
      .getByTestId('basket-card')
      .getByTestId('product-image')
    this.basketProductCard = page.getByTestId('basket-card')
    this.basketContainer = page.getByTestId('basket-container')
    this.basketTitle = this.basketContainer.getByTestId('headline').nth(0)
    this.basketSubTitle = this.basketContainer.getByTestId('headline').nth(1)
    this.loginButton = page.getByTestId('button-signin')
    this.continueButton = page.getByTestId('button-continue-shopping')
    this.productBrand = page
      .getByTestId('basket-product-brand')
      .getByTestId('main-label')
    this.productName = page
      .getByTestId('basket-product-brand')
      .getByTestId('sub-label')
    this.removeItemButton = page.getByTestId('basket-remove-item-button')
    this.confirmRemoveItemButton = page.getByTestId(
      'basket-remove-item-confirm-button',
    )
  }

  async gotoCheckoutPage(index: number) {
    await this.checkoutButton.nth(index).waitFor({ state: 'visible' })
    await this.checkoutButton.nth(index).click()
  }

  async assertProductIsInBasket(productBrand: string, productName: string) {
    const basketProductBrandText = await this.productBrand.textContent()
    const basketProductNameText = await this.productName.textContent()

    await expect(this.basketProductCard).toBeVisible()
    await expect(this.productImage).toBeVisible()
    expect(basketProductBrandText).toEqual(productBrand)
    expect(basketProductNameText).toEqual(productName)
  }

  async assertContinueButton() {
    await expect(this.continueButton).toBeVisible()
    await this.continueButton.click()

    await this.page.waitForURL(HOMEPAGE_PATH_DE)
    const pageUrl = this.page.url()
    expect(pageUrl).toContain(HOMEPAGE_PATH_DE)
  }

  async assertLoginButton() {
    await expect(this.loginButton).toBeVisible()
    await this.loginButton.waitFor()
    await this.loginButton.click()
    await this.page.waitForLoadState('networkidle')
  }

  async addProductToBasket(variantId: number, quantity: number) {
    try {
      await this.rpc.call('addItemToBasket', {
        variantId,
        quantity,
      })
    } catch (error) {
      console.error('Error adding item to basket:', error)
      throw error
    }
  }

  async assertProductNotInBasket() {
    await expect(this.basketProductCard).not.toBeVisible()
    await expect(this.productImage).not.toBeVisible()
    await expect(this.loginButton).toBeVisible()
    await expect(this.continueButton).toBeVisible()
  }

  async emptyBasket(itemKey: string) {
    try {
      await this.rpc.call('removeItemFromBasket', {
        itemKey,
      })
    } catch (error) {
      console.error('Error removing item from basket:', error)
      throw error
    }
  }

  async removeItemFromBasket() {
    await this.removeItemButton.click()
    await this.confirmRemoveItemButton.click()
  }
}
