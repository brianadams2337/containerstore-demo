import { BasePage } from './basePage'
import Header from './components/header'

class BasketPage extends BasePage {
  private pageElements = {
    headline: '[data-testid="headline"]',
    productInBasket: '[data-test-id="basket-card"]',
    addToWishlistButton: '[data-test-id="basket-add-to-wishlist-button"]',
    removeFromWishlistButton:
      '[data-test-id="basket-remove-from-wishlist-button"]',
    productImage: '[data-testid="product-image"]',
    removeItemButton: '[data-test-id="basket-remove-item-button"]',
    removeItemConfirmationButton:
      '[data-test-id="basket-remove-item-confirm-button"]',
    quantityDropdown: '[data-test-id="quantity-dropdown-amount"]',
    checkoutButton: '[data-test-id="checkout-link"]',
    promotionBanner: '[data-test-id="promotion-banner"]',
    promotionCountdown: '[data-test-id="promotion-countdown"]',
    basketCardPrice: '[data-test-id="basket-card-prices"]',
    basketCardReductionPrice: '[data-test-id="basket-card-reduction-price"]',
    basketSummaryPromotions: '[data-test-id="basket-summary-promotions"]',
    basketSummaryPromotionItem:
      '[data-test-id="basket-summary-promotion-item"]',
  }

  open(waitForDisplayed = true): void {
    cy.visitAndWait('/basket')
    if (waitForDisplayed) {
      this.waitForPageToBeDisplayed()
    }
  }

  waitForPageToBeDisplayed(): void {
    Header.assertHeaderIsDisplayed()
    cy.get(this.pageElements.headline).should('be.visible')
  }

  assertThatProductIsPresent(): void {
    cy.get(this.pageElements.productInBasket).should('be.visible')
    cy.get(this.pageElements.productImage).should('be.visible')
  }

  clickOnProductImage(index = 0) {
    cy.get(this.pageElements.productImage).eq(index).click()
  }

  checkAddToCartTrackingEvent(): void {
    cy.log('event add_to_cart should be triggered')
    cy.expectTrackingEventInDatalayer('add_to_cart')
  }

  checkGetCartTrackingEvent(): void {
    cy.log('event cart should be triggered')
    cy.wait(2000)
    cy.expectTrackingEventInDatalayer('cart')
  }

  assertQuantityCount(count: number): void {
    cy.get(this.pageElements.quantityDropdown).contains(count.toString())
  }

  addToWishlist(index: number): void {
    this.waitForPageToBeDisplayed()
    cy.get(this.pageElements.addToWishlistButton)
      .eq(index)
      .should('exist')
      .scrollIntoView()
      .click({ force: true })
    cy.get(this.pageElements.removeFromWishlistButton)
  }

  clickRemoveItemButton(): void {
    cy.get(this.pageElements.removeItemButton).should('be.visible').click()
  }

  removeProductFromCart(): void {
    this.clickRemoveItemButton()
    cy.get(this.pageElements.removeItemConfirmationButton)
      .should('be.visible')
      .click({ force: true })
  }

  removeProductFromCartBySwipe(index = 0): void {
    this.waitForPageToBeDisplayed()
    cy.get(this.pageElements.productInBasket)
      .eq(index)
      .scrollIntoView()
      .realSwipe('toLeft', { length: 250, touchPosition: 'right' })
  }

  clickCheckoutButton(): void {
    cy.get(this.pageElements.checkoutButton).click()
    Cypress.on('uncaught:exception', (_err, _runnable) => {
      // returning false here prevents Cypress from failing the test
      return false
    })
  }

  checkRemoveFromCartTrackingEvent(): void {
    cy.log('event remove_from_cart should be triggered')
    cy.expectTrackingEventInDatalayer('remove_from_cart')
  }

  assetTimerbox(): void {
    cy.get(this.pageElements.promotionCountdown)
      .invoke('text')
      .should('match', /\d{2,3}[A-Z]:\d{2}[A-Z]:\d{2}[A-Z]/)
  }

  assertProductCardPrice(): void {
    cy.get(this.pageElements.basketCardPrice)
      .should('exist')
      .within(() => {
        cy.get(this.pageElements.basketCardReductionPrice)
          .should('exist')
          .should('have.attr', 'style')
          .and('include', 'color: rgba')
          .and('include', 'background-color: rgba')
      })
  }

  assertBasketSummaryWithPromotion(): void {
    cy.get(this.pageElements.basketSummaryPromotions).should('be.visible')
    cy.get(this.pageElements.basketSummaryPromotionItem).should('be.visible')
  }
}
export default new BasketPage()
