import type { Locator, Page } from '@playwright/test'
import { expect } from '../fixtures/fixtures'
import { isMobile } from '../support/utils'

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
  readonly addressMobile: Locator
  readonly ordersHeadline: Locator
  readonly orderItemHeadline: Locator
  readonly orderDetailsBackButton: Locator
  readonly orderDetailsHeadline: Locator
  readonly emptyState: Locator

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
    this.addressMobile = page.getByTestId('address-card-mobile')
    this.ordersHeadline = page.getByTestId('orders-headline')
    this.orderItemHeadline = page.getByTestId('order-item-headline')
    this.orderDetailsBackButton = page.getByTestId('back-to-order-list')
    this.orderDetailsHeadline = page.getByTestId('order-detail-headline')
    this.emptyState = page.getByTestId('empty-state')
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
    await this.orderListItem.first().click()
    await this.orderItems.waitFor()
    if (isMobile(this.page)) {
      await expect(this.addressMobile.first()).toBeVisible()
    } else {
      await expect(this.addressCard.first()).toBeVisible()
    }
    await expect(this.orderStatusBar).toBeVisible()
    await expect(this.orderItemCard).toBeVisible()
  }

  async assertPaymentArea() {
    await this.paymentHeader.waitFor()
    await expect(this.paymentOrderValue).toBeVisible()
    await expect(this.paymentShippingCost).toBeVisible()
  }

  orderDetailsButton(order: string): Locator {
    return this.page.getByTestId(`go-to-order-detail-${order}`)
  }

  ordersPageButton(page: string): Locator {
    return this.page.getByTestId(`paginationButton-${page}`)
  }

  async selectOrder(order: string) {
    await this.orderDetailsButton(order).waitFor()
    await this.orderDetailsButton(order).click()
  }

  async selectPage(page: string) {
    await this.ordersPageButton(page).waitFor()
    await this.ordersPageButton(page).click()
  }
}
