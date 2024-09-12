import type { Locator, Page } from '@playwright/test'
import { isMobile } from '../support/utils'

export class WishlistPage {
  readonly page: Page
  readonly emptyState: Locator
  readonly wishlistCount: Locator
  readonly buttonContinueShopping: Locator
  readonly buttonSignIn: Locator
  readonly emptyStateIcon: Locator
  readonly emptyStateHeadline: Locator
  readonly emptyStateSubheadline: Locator
  readonly wishlistItemsWrapper: Locator
  readonly wishlistCard: Locator
  readonly article: Locator
  readonly productBrand: Locator
  readonly productName: Locator
  readonly buttonSize: Locator
  readonly buttonAddtoCart: Locator
  readonly buttonAddtoCartMobile: Locator
  readonly variantPicker: Locator
  readonly productSize: Locator
  readonly buttonRemoveFromWishlist: Locator
  readonly slideInOverflow: Locator

  constructor(page: Page) {
    this.page = page
    this.emptyState = page.getByTestId('empty-state')
    this.wishlistCount = page.getByTestId('wishlist-count')
    this.buttonContinueShopping = page.getByTestId('button-continue-shopping')
    this.buttonSignIn = page.getByTestId('button-signin')
    this.emptyStateIcon = this.emptyState.getByTestId('empty-state-icon')
    this.emptyStateHeadline = this.emptyState.getByTestId('headline').nth(0)
    this.emptyStateSubheadline = this.emptyState.getByTestId('headline').nth(1)
    this.wishlistItemsWrapper = page.getByTestId('wishlist-items-wrapper')
    this.wishlistCard = this.wishlistItemsWrapper.getByTestId('wishlist-card')
    this.article = this.wishlistCard.getByTestId('article')
    this.productBrand = this.article.getByTestId('product-brand')
    this.productName = this.article.getByTestId('product-name')
    this.buttonSize = this.article.getByTestId('wishlist-card-product-size')
    this.buttonAddtoCart = page.getByTestId('wishlist-card-add-to-cart')
    this.buttonAddtoCartMobile = page.getByTestId('add-to-cart-image-mobile')
    this.variantPicker = page.getByTestId('product-size-picker-toggle')
    this.productSize = page.locator(
      '[data-testid="product-size"] >> button:not([disabled=""])',
    )
    this.buttonRemoveFromWishlist = page.getByTestId(
      'remove-item-from-wishlist-button',
    )
    this.slideInOverflow = page.getByTestId('slide-in-overflow')
  }

  radioButtonSize(size: string): Locator {
    return this.page.getByTestId(`radio-button-${size}`)
  }

  async visitWishlistPage(path: string, baseUrl: string) {
    const url = baseUrl + path
    await this.page.goto(url, { waitUntil: 'commit' })
  }

  async addProductToWishlist(productId: number) {
    try {
      await this.page.request.post('/de/api/rpc/addItemToWishlist', {
        data: {
          payload: { productId },
        },
      })
    } catch (error) {
      console.error('Error adding item to wishlist:', error)
      throw error
    }
  }

  async chooseProductSize() {
    if (isMobile(this.page)) {
      await this.slideInOverflow.waitFor()
      await this.radioButtonSize('s').click({ force: true })
    } else {
      await this.buttonSize.click()
      await this.variantPicker.click()
      await this.productSize.first().click()
    }
  }

  async addProductToBasket() {
    if (isMobile(this.page)) {
      await this.buttonAddtoCartMobile.waitFor()
      await this.buttonAddtoCartMobile.click()
      await this.page.waitForLoadState('networkidle')
    } else {
      await this.buttonAddtoCart.waitFor()
      await this.buttonAddtoCart.click()
    }
    await this.page.waitForLoadState('domcontentloaded')
  }

  async removeItemFromWishlist() {
    await this.wishlistCard.hover()
    await this.buttonRemoveFromWishlist.waitFor()
    await this.buttonRemoveFromWishlist.click()
    await this.page.waitForLoadState('domcontentloaded')
  }
}
