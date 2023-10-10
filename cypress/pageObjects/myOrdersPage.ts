import { BasePage } from './basePage'

class MyOrdersPage extends BasePage {
  private pageElements = {
    delivery: '[id="itemPackages"]',
    addressCard: '[data-test-id="address-card"]',
    mobileAddress: '[id="content-shipping"]',
    item: '[data-test-id="order-item-card"]',
    totalPrice: '[id="paymentHeader"] [class="p-5"]',
    mobileOrder: 'a[href*="/account/orders/"]',
  }

  open() {
    cy.visit('/account/orders')
    this.openOrderByIndex()
    this.waitForMyOrdersPageIsDisplayed()
  }

  waitForMyOrdersPageIsDisplayed(): void {
    cy.get(this.pageElements.item)
  }

  assertAddress(text: string): void {
    if (Cypress.env().mobile === true) {
      cy.get(this.pageElements.mobileAddress).contains(text)
    } else {
      cy.get(this.pageElements.addressCard).contains(text)
    }
  }

  assertDelivery(text: string): void {
    cy.get(this.pageElements.delivery).contains(text)
  }

  assertItem(text: string): void {
    cy.get(this.pageElements.item).contains(text)
  }

  assertTotalPrice(text: string): void {
    cy.get(this.pageElements.totalPrice).contains(text)
  }

  openOrderByIndex(index = 0) {
    cy.get(this.pageElements.mobileOrder).eq(index).click({ force: true })
  }
}

export default new MyOrdersPage()
