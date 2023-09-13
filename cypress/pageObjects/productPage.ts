import { BasePage } from './basePage'
import Header from './components/header'
import Chainable = Cypress.Chainable

class ProductPage extends BasePage {
  private pageElements = {
    zoomGallery: '[data-test-id="zoom-gallery"]',
    productDetails: '[data-test-id="product-detail-page"]',
    tilledGallery: '[data-test-id="tilled-gallery"]',
    productImages: '[data-test-id="product-image"]',
    addToWishlistButton: '[data-test-id="add-item-to-wishlist-button"]',
    removeFromWishlistButton:
      '[data-test-id="remove-item-from-wishlist-button"]',
    price: '[data-test-id="price"]',
    priceBeforeSale: '[data-test-id="initialProductPrice"]',
    category: '[data-test-id="categoryOnProductDetailPage"]',
    notificationPopup: '[data-test-id="toast-info"]',
    productName: '[data-test-id="pdp-product-name"]',
    addToCartButton: '[data-test-id="add-item-to-basket-button"]',
    colorOption: (ID: number) => {
      return `[data-color-id="${ID}"]`
    },
    sizeMenuToggle: '[data-test-id="product-size-picker-toggle"]',
    size: '[data-test-id="product-size"]',
    backButton: '[data-test-id="back-button"]',
    shopLogo: '.max-w-full',
    siblingColorsSelector:
      '[class="mt-6"] [data-test-id="siblingColorsSelector"]',
    siblingColorBlue: '[data-color-id="10"]',
    closeButton: 'button[data-test-id="close-button"]',
    combineWithSlider: '[data-test-id="combine-with-slider"]',
    combineWithSliderSoldOutProductId: '[data-product-card-id="3"]',
  }

  openProduct(item: string): void {
    cy.visitAndWait(item)
    this.waitForPageToBeDisplayed()
  }

  waitForPageToBeDisplayed(): void {
    Header.assertHeaderIsDisplayed()
    cy.get(this.pageElements.productImages).should('exist')
    cy.get(this.pageElements.price).should('exist')
    cy.get(this.pageElements.addToWishlistButton).should('exist')
    cy.get(this.pageElements.addToCartButton).should('exist')
  }

  addProductToWishlist(): void {
    Header.assertHeaderIsDisplayed()
    cy.get(this.pageElements.addToWishlistButton).should('exist')
    cy.get(this.pageElements.addToWishlistButton).click()
    cy.get(this.pageElements.notificationPopup).should('exist')
    cy.waitForXHR()
    cy.get(this.pageElements.removeFromWishlistButton).should('exist')
  }

  getProductName(): Chainable {
    return cy.get(this.pageElements.productName)
  }

  assertProductName(expectedName: string) {
    this.getProductName()
      .invoke('text')
      .then((text: string) => {
        expect(text.toLowerCase()).contain(expectedName.toLowerCase())
      })
  }

  getProductPrice(): Chainable {
    return cy.get(this.pageElements.price)
  }

  assertProductPrice(price: string) {
    if (Cypress.env('lang') === 'en-EN') {
      price = price.replace(',', '.')
    }

    this.getProductPrice()
      .invoke('text')
      .then((text: string) => {
        expect(text).contain(price)
      })
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

  getProductCategory(): Chainable {
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
    cy.get(this.pageElements.sizeMenuToggle).first().click()
  }

  selectAvailableSize(entry = 0) {
    this.openProductSizeMenu()
    cy.get(this.pageElements.size)
      .not('[disabled="disabled"]')
      .eq(entry)
      .click()
  }

  addToCart() {
    cy.get(this.pageElements.addToCartButton).should('exist').click()
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

  clickOnProductImage(index = 0): void {
    cy.get(this.pageElements.productImages).eq(index).click()
  }
}

export default new ProductPage()
