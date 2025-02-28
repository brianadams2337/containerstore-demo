import type { Locator, Page } from '@playwright/test'
import { HOMEPAGE_PATH_DE } from '../support/constants'
import { expect } from '../fixtures/fixtures'
import type { RPC } from './components/rpc'
import { isMobile } from '../support/utils'

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
  readonly headlineUnavailableProducts: Locator
  readonly soldOutTitle: Locator
  readonly unavailableProductList: Locator
  readonly quantitySelector: Locator
  readonly soldOutQuantitySelector: Locator
  readonly soldOutDeleteButton: Locator
  readonly soldOutProductImage: Locator
  readonly quantityValue: Locator
  readonly buttonQuantityDecrease: Locator
  readonly buttonQuantityIncrease: Locator
  readonly initialProductPrice: Locator
  readonly productPrice: Locator

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
    this.headlineUnavailableProducts = page.getByTestId(
      'headline-unavailable-products',
    )
    this.soldOutTitle = page.getByTestId('basket-card-sold-out-title')
    this.unavailableProductList = page.getByTestId('unavailable-product-list')
    this.quantitySelector = page.getByTestId('quantity-selector')
    this.soldOutQuantitySelector =
      this.unavailableProductList.getByTestId('quantity-selector')
    this.soldOutDeleteButton = this.unavailableProductList.getByTestId(
      'basket-remove-item-button',
    )
    this.soldOutProductImage =
      this.unavailableProductList.getByTestId('product-image')
    this.quantityValue = page.getByTestId('quantity-value')
    this.buttonQuantityDecrease = page.getByTestId('quantity-minus')
    this.buttonQuantityIncrease = page.getByTestId('quantity-plus')
    this.initialProductPrice = page.getByTestId('initialProductPrice')
    this.productPrice = page.getByTestId('price')
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
    await this.page.waitForTimeout(500)
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

  async assertSoldOutImageOpacity(opacity: string) {
    const productImageOpacity = await this.page.$eval(
      '[data-testid="unavailable-product-list"] >> [data-testid="product-image"]',
      (el) => String(window.getComputedStyle(el).opacity).trim(),
    )
    expect(productImageOpacity).toBe(opacity)
  }

  async assertQuantityValue(value: string) {
    let index: number
    if (isMobile(this.page)) {
      index = 1
    } else {
      index = 0
    }
    await expect(this.quantityValue.nth(index)).toHaveValue(value)
  }

  async updateProductQuantity(action: string) {
    let index: number
    if (isMobile(this.page)) {
      index = 1
    } else {
      index = 0
    }
    if (action === 'plus') {
      await this.buttonQuantityIncrease.nth(index).click()
    }
    if (action === 'minus') {
      await this.buttonQuantityDecrease.nth(index).click()
    }
    await this.page.waitForLoadState('networkidle')
  }

  async assertQuantityButtonState(buttonType: string, enabled: boolean) {
    let index: number
    if (isMobile(this.page)) {
      index = 1
    } else {
      index = 0
    }
    if (buttonType === 'plus') {
      await expect(this.buttonQuantityIncrease.nth(index)).toBeEnabled({
        enabled,
      })
    }
    if (buttonType === 'minus') {
      await expect(this.buttonQuantityDecrease.nth(index)).toBeEnabled({
        enabled,
      })
    }
  }

  async assertInitialPriceVisibility(visible: boolean) {
    if (isMobile(this.page)) {
      await expect(this.initialProductPrice.nth(1)).toBeVisible({
        visible,
      })
    } else {
      await expect(this.initialProductPrice.nth(0)).toBeVisible({
        visible,
      })
    }
  }

  async assertFinalProductPrice(priceValue: string, containsValue: boolean) {
    const shouldContain = containsValue
    if (shouldContain) {
      if (isMobile(this.page)) {
        await expect(this.productPrice.nth(1)).toContainText(priceValue)
      } else {
        await expect(this.productPrice.nth(0)).toContainText(priceValue)
      }
    } else {
      if (isMobile(this.page)) {
        await expect(this.productPrice.nth(1)).not.toHaveText(priceValue)
      } else {
        await expect(this.productPrice.nth(0)).not.toHaveText(priceValue)
      }
    }
  }
}
