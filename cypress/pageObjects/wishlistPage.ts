import { getLocaleFile } from '../test-helpers'
import { BasePage } from './basePage'
import Header from './components/header'
const locale = getLocaleFile()

class WishlistPage extends BasePage {
  private pageElements = {
    headline: '[data-test-id="headline"]',
    productInWishlist: '[data-test-id="wishlist-card"]',
    productPrice: '[data-test-id="wishlist-product-price"]',
    productSize: '[data-test-id="wishlist-card-product-size"]',
    productSizeMobile: '[name="variant_size"]',
    sizeMenuToggle: '[data-test-id="product-size-picker-toggle"]',
    productSizePickerOption: '[data-test-id="product-size"]',
    wishlistCardAddToCartButton:
      '[class="hidden lg:block"] [data-test-id="wishlist-card-add-to-cart"]',
    wishlistCardAddToCartMobileButton:
      '[data-test-id="wishlist-card-add-to-cart-mobile"]',
    removeFromListButton:
      '[data-test-id="product-card-action-remove-item-from-wishlist-button"]',
    continueShoppingButton: '[href="/"]',
    signInButton: '[href="/signin"]',
    wishlistCount: '[data-test-id="wishlist-count"]',
    emptyWishlistButtons: '.px-8 > .mt-8',
  }

  open(waitForDisplayed = true): void {
    cy.visitAndWait('/wishlist')
    if (waitForDisplayed) {
      this.waitForPageToBeDisplayed()
    }
  }

  waitForPageToBeDisplayed(): void {
    Header.assertHeaderIsDisplayed()
    cy.get(this.pageElements.headline).should('be.visible')
  }

  assertThatProductIsPresent(): void {
    cy.get(this.pageElements.productInWishlist).should('be.visible')
  }

  assertThatProductPriceIsPresent(): void {
    cy.get(this.pageElements.productPrice).should('be.visible')
  }

  assertThatProductSizeIsPresent(sizeToCheck?: string): void {
    cy.get(this.pageElements.productSize).should('be.visible')
    if (sizeToCheck) {
      cy.get(this.pageElements.productSize).contains(sizeToCheck)
    }
  }

  changeProductSize(sizeToChangeTo: string): void {
    cy.get(this.pageElements.productSize).click()
    cy.get(this.pageElements.sizeMenuToggle).click()
    cy.get(this.pageElements.productSizePickerOption)
      .contains(sizeToChangeTo)
      .click()
  }

  changeProductSizeByIndex(index: number): void {
    if (Cypress.env().mobile !== true) {
      cy.get(this.pageElements.productSize).click()
      cy.get(this.pageElements.sizeMenuToggle).click()
      cy.get(this.pageElements.productSizePickerOption).eq(index).click()
    } else {
      cy.get(this.pageElements.productSizeMobile)
        .eq(index)
        .click({ force: true })
    }
  }

  assertThatProductSizeButtonIsPresent(amount = 1): void {
    cy.get(this.pageElements.productSize)
      .should('be.visible')
      .should('have.length.gte', amount)
  }

  assertThatAddToCartButtonIsPresent(amount = 1): void {
    cy.get(this.pageElements.wishlistCardAddToCartButton)
      .should('be.visible')
      .should('have.length.gte', amount)
  }

  addProductToCart(entry = 0): void {
    if (Cypress.env().mobile !== true) {
      cy.get(this.pageElements.wishlistCardAddToCartButton).eq(entry).click()
    } else {
      cy.get(this.pageElements.wishlistCardAddToCartMobileButton)
        .eq(entry)
        .click({ force: true })
    }
  }

  checkWishlistTrackingEvent(): void {
    cy.log('event wishlist should be triggered')
    cy.expectTrackingEventInDatalayer('wishlist')
  }

  checkAddToWishlistTrackingEvent(): void {
    cy.log('event add_to_wishlist should be triggered')
    cy.expectTrackingEventInDatalayer('add_to_wishlist')
  }

  checkRemoveFromWishlistTrackingEvent(): void {
    cy.log('event remove_from_wishlist should be triggered')
    cy.expectTrackingEventInDatalayer('remove_from_wishlist')
  }

  clearWishlist(): void {
    cy.get('body').then(($body) => {
      if ($body.find(this.pageElements.removeFromListButton)) {
        cy.get(this.pageElements.removeFromListButton)
          .each(($el) => {
            cy.wrap($el).click()
          })
          .then(() => {
            cy.contains(locale.wishlist.continue_shopping_label)
          })
      }
    })
  }

  assertHeaderText() {
    cy.get(this.pageElements.headline).contains(locale.wishlist.no_items_info)
  }

  assertThatContinueShoppingButtonIsPresent() {
    cy.get(this.pageElements.continueShoppingButton).contains(
      locale.wishlist.continue_shopping_label,
    )
  }

  assertThatSignInButtonIsPresent() {
    cy.get(this.pageElements.signInButton).contains(
      locale.wishlist.sign_in_label,
    )
  }

  assertThatWishlistIsEmpty() {
    cy.get(this.pageElements.wishlistCount).should(
      'contain.text',
      locale.wishlist.products_count.split(' | ')[0],
    )
  }

  assertThatSignInButtonIsNotPresent() {
    cy.get(this.pageElements.emptyWishlistButtons)
      .children('a')
      .should('not.contain', locale.wishlist.sign_in_label)
  }
}
export default new WishlistPage()
