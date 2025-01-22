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
  readonly emptyState: Locator
  readonly basketTitle: Locator
  readonly basketSubTitle: Locator
  readonly loginButton: Locator
  readonly continueButton: Locator
  readonly productBrand: Locator
  readonly productName: Locator
  readonly removeItemButton: Locator
  readonly confirmRemoveItemButton: Locator
  readonly priceSubtotal: Locator
  readonly priceSubtotalMobile: Locator
  readonly priceFinal: Locator
  readonly discountSale: Locator
  readonly discountPromotion: Locator
  readonly promotionSummaryToggleButton: Locator
  readonly totalPromotionDiscount: Locator

  constructor(page: Page, rpc: RPC) {
    this.page = page
    this.rpc = rpc
    this.checkoutButton = page.getByTestId('checkout-link')
    this.productInBasket = page.getByTestId('basket-card')
    this.productImage = page
      .getByTestId('basket-card')
      .getByTestId('product-image')
    this.basketProductCard = page.getByTestId('basket-card')
    this.emptyState = page.getByTestId('empty-state')
    this.basketTitle = this.emptyState.getByTestId('headline').nth(0)
    this.basketSubTitle = this.emptyState.getByTestId('empty-state-subheadline')
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
    this.priceSubtotal = page.getByTestId('basket-price-subtotal')
    this.priceSubtotalMobile = page.getByTestId('basket-price-subtotal-mobile')
    this.priceFinal = page.getByTestId('basket-final-price')
    this.discountSale = page.getByTestId('basket-discount-sale')
    this.discountPromotion = page.getByTestId('basket-discount-promotion')
    this.promotionSummaryToggleButton = page.getByTestId(
      'promotion-summary-toggle-button',
    )
    this.totalPromotionDiscount = page.getByTestId(
      'summary-total-promotion-reduction',
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

  async assertBasketPriceSummary(
    subtotalPrice: Locator,
    finalPrice: Locator,
    isMobile: boolean,
    discount?: Locator,
  ) {
    let index: number
    if (isMobile) {
      index = 0
    } else {
      index = 1
    }
    const priceSubtotalLabel = await subtotalPrice.textContent()
    const priceFinalLabel = await finalPrice.nth(index).textContent()
    let discountValue: number
    if (discount) {
      const discountLabel = await discount.nth(index).textContent()
      discountValue = parseFloat(
        discountLabel?.replace(/[^0-9.-]+/g, '') ?? '0',
      )
    } else {
      discountValue = 0
    }

    const priceSubtotalValue = parseFloat(
      priceSubtotalLabel?.replace(/[^0-9.-]+/g, '') ?? '0',
    )

    const priceFinalValue = parseFloat(
      priceFinalLabel?.replace(/[^0-9.-]+/g, '') ?? '0',
    )

    expect(priceFinalValue).toEqual(priceSubtotalValue + discountValue)
    expect(priceSubtotalValue).toEqual(
      priceFinalValue + Math.abs(discountValue),
    )
  }
}
