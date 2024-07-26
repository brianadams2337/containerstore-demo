import { BasePage } from './basePage'
import Header from './components/header'

class ProductPage extends BasePage {
  private pageElements = {
    zoomGallery: '[data-test-id="zoom-gallery"]',
    productDetails: '[data-test-id="product-detail-page"]',
    tilledGallery: '[data-test-id="tilled-gallery"]',
    productImages: '[data-testid="product-image"]',
    addToWishlistButton: '[data-testid="add-item-to-wishlist-button"]',
    promotionCountdown: '[data-test-id="promotion-countdown"]',
    removeFromWishlistButton:
      '[data-testid="remove-item-from-wishlist-button"]',
    price: '[data-test-id="price"]',
    priceBeforeSale: '[data-test-id="initialProductPrice"]',
    category: '[data-test-id="categoryOnProductDetailPage"]',
    notificationPopup: '[data-test-id="toast-info"]',
    productName: '[data-test-id="pdp-product-name"]',
    addToCartButton: '[data-test-id="add-item-to-basket-button"]',
    colorOption: (ID: number) => {
      return `[data-color-id="${ID}"]`
    },
    sizeMenuToggle: '[data-testid="product-size-picker-toggle"]',
    quantityMenuToggle: '[data-test-id="product-quantity-picker-toggle"]',
    size: '[data-testid="product-size"]',
    backButton: '[data-test-id="back-button"]',
    shopLogo: '.max-w-full',
    siblingColorsSelector:
      '[class="mt-6"] [data-test-id="siblingColorsSelector"]',
    siblingColorBlue: '[data-color-id="10"]',
    closeButton: 'button[data-test-id="close-button"]',
    combineWithSlider: '[data-test-id="combine-with-slider"]',
    combineWithSliderSoldOutProductId: '[data-product-card-id="3"]',
    productPromotionGifts: '[data-test-id="product-promotion-gifts"]',
    productPromotionGiftItem: '[data-test-id="product-promotion-gift-item"]',
  }

  openProduct(item: string): void {
    cy.visitAndWait(item)
    this.waitForPageToBeDisplayed()
  }

  waitForPageToBeDisplayed(): void {
    Header.assertHeaderIsDisplayed()
    cy.get(this.pageElements.productImages).should('exist')
    cy.get(this.pageElements.price).should('exist')
    cy.get(this.pageElements.addToCartButton).should('exist')
  }

  addProductToWishlist(): void {
    Header.assertHeaderIsDisplayed()
    cy.get(this.pageElements.addToWishlistButton).eq(0).should('exist')
    cy.wait(1000)
    cy.get(this.pageElements.addToWishlistButton).eq(0).click({ force: true })
    // cy.get(this.pageElements.notificationPopup).should('exist')
    cy.scrollTo('top')
    cy.waitForXHR()
    cy.get(this.pageElements.removeFromWishlistButton).should('exist')
  }

  getProductName(): Cypress.Chainable {
    return cy.get(this.pageElements.productName)
  }

  assertProductName(expectedName: string) {
    this.getProductName()
      .invoke('text')
      .then((text: string) => {
        expect(text.toLowerCase()).contain(expectedName.toLowerCase())
      })
  }

  getProductPrice(): Cypress.Chainable {
    return cy.get(this.pageElements.price)
  }

  assertProductPrice(price: string) {
    if (Cypress.env('lang') === 'en-EN') {
      price = price.replace(',', '.')
    }

    cy.get(this.pageElements.price).should('contain', price)
  }

  isAddToCartDisabled() {
    cy.get(this.pageElements.addToCartButton)
      .should('exist')
      .should('be.disabled')
  }

  isCombineWithSliderDisplayed() {
    cy.get(this.pageElements.combineWithSlider).should('exist')
  }

  isSoldOutProductNotDisplayedInCombineWithSlider() {
    cy.get(this.pageElements.combineWithSliderSoldOutProductId).should(
      'not.exist',
    )
  }

  isCombineWithSliderNotDisplayed() {
    cy.get(this.pageElements.combineWithSlider).should('not.exist')
  }

  assertSizePresent() {
    cy.get(this.pageElements.sizeMenuToggle).should('exist')
  }

  getProductCategory(): Cypress.Chainable {
    return cy.get(this.pageElements.category)
  }

  assertProductCategory(category: string) {
    this.getProductCategory()
      .invoke('text')
      .then((text: string) => {
        expect(text.toLowerCase()).contain(category.toLowerCase())
      })
  }

  openProductSizeMenu() {
    cy.wait(1000)
    cy.get(this.pageElements.sizeMenuToggle).click({ force: true })
  }

  selectAvailableSize(entry = 0) {
    this.openProductSizeMenu()
    cy.get(this.pageElements.size)
      .not('[disabled="disabled"]')
      .eq(entry)
      .find('button')
      .click({ force: true })
  }

  addToCart() {
    cy.get(this.pageElements.addToCartButton)
      .should('exist')
      .click({ force: true, multiple: true })
  }

  checkViewItemTrackingEvent(): void {
    cy.window().then(({ dataLayer }) => {
      const latestViewItemEvent =
        dataLayer.filter((v) => v.event === 'view_item').pop() || null
      expect(Boolean(latestViewItemEvent))
      if (latestViewItemEvent) {
        expect(latestViewItemEvent.ecommerce.items.length).equal(1)
      }
    })
  }

  clickBackButton(): void {
    cy.get(this.pageElements.backButton).click({ force: true })
  }

  clickShopLogo() {
    cy.get(this.pageElements.shopLogo).click()
  }

  assertSiblingColorsSelector() {
    cy.get(this.pageElements.siblingColorsSelector).should('be.visible')
  }

  clickSiblingColorBlue(): void {
    cy.get(this.pageElements.siblingColorBlue).click()
  }

  assertTilledGalleryIsDisplayed(): void {
    cy.get(this.pageElements.tilledGallery).should('be.visible')
  }

  clickCloseButton() {
    cy.get(this.pageElements.closeButton).click()
  }

  clickOnProductImage(index = 1): void {
    cy.get(this.pageElements.productImages).eq(index).click()
  }

  assertTimerbox() {
    cy.get(this.pageElements.promotionCountdown)
      .invoke('text')
      .should('match', /\d{2,3}[A-Z]:\d{2}[A-Z]:\d{2}[A-Z]$/g)
  }

  assertProductGiftItemsIfConditionsMet() {
    cy.get(this.pageElements.productPromotionGifts).should('exist')
    cy.get(this.pageElements.productPromotionGiftItem).within(() => {
      cy.get('picture').should('have.class', 'grayscale')
      cy.get('h3').should('have.class', 'text-secondary')
      cy.get('button').should('be.disabled')
    })
  }

  assertProductGiftIfConditionsMet() {
    cy.get(this.pageElements.productPromotionGifts).should('exist')
    cy.get(this.pageElements.productPromotionGiftItem).within(() => {
      cy.get('picture').should('not.have.class', 'grayscale')
      cy.get('h3').should('not.have.class', 'text-secondary')
      cy.get('button').should('not.be.disabled')
    })
  }
}

export default new ProductPage()
