import type { Locator, Page } from '@playwright/test'
import { isMobile } from '../support/utils'
import { expect } from '../fixtures/fixtures'

export class ProductDetailPage {
  readonly page: Page
  readonly productSizePickerToggle: Locator
  readonly addToBasketButton: Locator
  readonly productImage: Locator
  readonly productBrand: Locator
  readonly productName: Locator
  readonly priceRegular: Locator
  readonly taxInfo: Locator
  readonly variantPicker: Locator
  readonly addToBasketButtonMobile: Locator
  readonly quantityValue: Locator
  readonly quantityMinus: Locator
  readonly quantityPlus: Locator
  readonly buttonAddToWishlist: Locator
  readonly buttonRemoveFromWishlist: Locator
  readonly subscriptionService: Locator
  readonly addToBasketButtonSubscribe: Locator
  readonly variantAvailabilityComponent: Locator
  readonly storeAvailabilityHeadline: Locator
  readonly storeAvailabilitySubline: Locator
  readonly buttonOpenStoreFlyout: Locator
  readonly storeSelectorSlideIn: Locator
  readonly storeInput: Locator
  readonly buttonSearchStore: Locator

  constructor(page: Page) {
    this.page = page
    this.productSizePickerToggle = page.getByTestId(
      'product-size-picker-toggle',
    )
    this.addToBasketButton = page.getByTestId('add-item-to-basket-button')
    this.productImage = page.getByTestId('product-image')
    this.productBrand = page.getByTestId('pdp-product-brand')
    this.productName = page.getByTestId('pdp-product-name')
    this.priceRegular = page.getByTestId('price')
    this.taxInfo = page.getByTestId('tax-info')
    this.variantPicker = page.getByTestId('variant-picker').getByRole('button')
    this.addToBasketButtonMobile = page.getByTestId(
      'add-to-basket-button-mobile',
    )
    this.quantityValue = page.getByTestId('quantity-value')
    this.quantityMinus = page.getByTestId('quantity-minus')
    this.quantityPlus = page.getByTestId('quantity-plus')
    this.buttonAddToWishlist = page.getByTestId('add-item-to-wishlist-button')
    this.buttonRemoveFromWishlist = page.getByTestId(
      'remove-item-from-wishlist-button',
    )
    this.subscriptionService = page.getByTestId('subscription-service')
    this.addToBasketButtonSubscribe = page.getByTestId(
      'add-item-to-basket-button-subscribe',
    )
    this.variantAvailabilityComponent = page.getByTestId(
      'store-variant-availability-component',
    )
    this.storeAvailabilityHeadline = page.getByTestId(
      'store-availability-headline',
    )
    this.storeAvailabilitySubline = page.getByTestId(
      'store-availability-subline',
    )
    this.buttonOpenStoreFlyout = page.getByTestId('button-open-store-flyout')
    this.storeSelectorSlideIn = page.getByTestId('slide-in-overflow')
    this.storeInput = page.getByTestId('store-input')
    this.buttonSearchStore = page.getByTestId('search-store-button')
  }

  getVariant(variantId?: string): Locator {
    const selector = variantId
      ? `button[data-testid="variant-option-${variantId}"]`
      : 'button[data-testid^="variant-option-"]:not([disabled])'

    return this.page.locator(selector).first()
  }

  async addProductToBasket() {
    if (isMobile(this.page)) {
      await this.addToBasketButtonMobile.click()
    } else {
      await this.page.waitForLoadState('networkidle')
      await this.addToBasketButton.click()
    }
  }

  async visitPDP(path: string, baseUrl: string) {
    const url = baseUrl + path
    await this.page.goto(url, { waitUntil: 'commit' })
  }

  async assertAddToWishlistIconVisibility() {
    if (isMobile(this.page)) {
      await this.buttonAddToWishlist.nth(0).waitFor()
      await expect(this.buttonAddToWishlist.nth(0)).toBeVisible()
      await expect(this.buttonAddToWishlist.nth(1)).not.toBeVisible()
      await expect(this.buttonRemoveFromWishlist.nth(0)).not.toBeVisible()
    } else {
      await this.buttonAddToWishlist.nth(1).waitFor()
      await expect(this.buttonAddToWishlist.nth(1)).toBeVisible()
      await expect(this.buttonAddToWishlist.nth(0)).not.toBeVisible()
      await expect(this.buttonRemoveFromWishlist.nth(1)).not.toBeVisible()
    }
  }

  async assertRemoveFromWishlistIconVisibility() {
    if (isMobile(this.page)) {
      await this.buttonRemoveFromWishlist.nth(0).waitFor()
      await expect(this.buttonRemoveFromWishlist.nth(0)).toBeVisible()
      await expect(this.buttonRemoveFromWishlist.nth(1)).not.toBeVisible()
      await expect(this.buttonAddToWishlist.nth(0)).not.toBeVisible()
    } else {
      await this.buttonRemoveFromWishlist.nth(1).waitFor()
      await expect(this.buttonRemoveFromWishlist.nth(1)).toBeVisible()
      await expect(this.buttonRemoveFromWishlist.nth(0)).not.toBeVisible()
      await expect(this.buttonAddToWishlist.nth(1)).not.toBeVisible()
    }
  }

  async addProductToWishlist() {
    if (isMobile(this.page)) {
      await this.buttonAddToWishlist.nth(0).click()
    } else {
      await this.buttonAddToWishlist.nth(1).click()
    }
  }

  async removeProductFromWishlist() {
    if (isMobile(this.page)) {
      await this.buttonRemoveFromWishlist.nth(0).click()
    } else {
      await this.buttonRemoveFromWishlist.nth(1).click()
    }
  }

  async assertStoreSelectorIsVisible(visible: boolean) {
    await expect(this.variantAvailabilityComponent).toBeVisible({
      visible,
    })
  }

  async assertStoreSelectorFlyoutIsVisible(visible: boolean, index: number) {
    await this.storeSelectorSlideIn.nth(index).waitFor()
    await expect(this.storeSelectorSlideIn.nth(index)).toBeVisible({ visible })
  }

  async typeStoreName(store: string) {
    await this.storeInput.waitFor()
    await this.storeInput.focus()
    await this.storeInput.fill(store)
    await this.page.waitForTimeout(100)
  }
}
