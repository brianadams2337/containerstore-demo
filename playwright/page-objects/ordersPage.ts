import type { Locator, Page } from '@playwright/test'
import { expect } from '../fixtures/fixtures'

export class OrdersPage {
  readonly page: Page
  readonly orderListItem: Locator
  readonly orderListItemTitle: Locator
  readonly orderListItemData: Locator
  readonly addressCard: Locator
  readonly orderItems: Locator
  readonly orderStatusBar: Locator
  readonly orderItemCard: Locator
  readonly paymentHeader: Locator
  readonly paymentOrderValue: Locator
  readonly paymentShippingCost: Locator
  readonly headlineNoOrders: Locator
  readonly buttonContinueShopping: Locator

  constructor(page: Page) {
    this.page = page
    this.orderListItem = page.getByTestId('order-history-list-item')
    this.orderListItemTitle = page.getByTestId('order-list-item-title')
    this.orderListItemData = page.getByTestId('order-list-item-data')
    this.addressCard = page.getByTestId('address-card')
    this.orderItems = page.getByTestId('order-items')
    this.orderStatusBar = page.getByTestId('order-status-bar')
    this.orderItemCard = page.getByTestId('order-item-card')
    this.paymentHeader = page.getByTestId('payment-header')
    this.paymentOrderValue = page.getByTestId('payment-order-value')
    this.paymentShippingCost = page.getByTestId('payment-shipping-cost')
    this.headlineNoOrders = page.getByTestId('headline-no-orders')
    this.buttonContinueShopping = page.getByTestId('button-continue-shopping')
  }

  async visitOrdersPage(path: string, baseUrl: string) {
    const url = baseUrl + path
    await this.page.goto(url, { waitUntil: 'load' })
  }

  async assertOrderListItem() {
    await this.orderListItem.first().waitFor()
    await expect(this.orderListItemTitle.first()).toBeVisible()
    await expect(this.orderListItemData.first()).toBeVisible()
  }

  async assertOrderItem() {
    await this.orderItems.waitFor()
    await expect(this.addressCard.first()).toBeVisible()
    await expect(this.orderStatusBar).toBeVisible()
    await expect(this.orderItemCard).toBeVisible()
  }

  async assertPaymentArea() {
    await this.paymentHeader.waitFor()
    await expect(this.paymentOrderValue).toBeVisible()
    await expect(this.paymentShippingCost).toBeVisible()
  }
}
