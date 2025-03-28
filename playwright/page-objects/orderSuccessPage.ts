import type { Locator, Page } from '@playwright/test'
import { expect } from '../fixtures/fixtures'

export class OrderSuccessPage {
  readonly page: Page
  readonly ospGreetingBox: Locator
  readonly ospGreetingBoxHeadline: Locator
  readonly ospOrderData: Locator
  readonly ospPaymentData: Locator
  readonly ospDeliveryAddress: Locator
  readonly ospBillingAddress: Locator
  readonly ospContinueShoppingButton: Locator
  readonly ospOrderDetailsButton: Locator
  readonly ospDeliveryDate: Locator
  readonly ospCarrier: Locator
  readonly ospProductCard: Locator
  readonly ospProductImage: Locator
  readonly ospProductBrand: Locator
  readonly ospProductName: Locator
  readonly ospProductColor: Locator
  readonly ospProductSize: Locator
  readonly ospProductQuantity: Locator
  readonly ospSubtotal: Locator
  readonly ospShippingCost: Locator
  readonly ospTotal: Locator
  readonly ospProductPrice: Locator
  readonly ospEmptyStateContainer: Locator
  readonly ospEmptyStateIcon: Locator
  readonly ospEmptyStateHeadline: Locator
  readonly ospEmptyStateSubheadline: Locator
  readonly ospEmptyStateContinueShoppingButton: Locator

  constructor(page: Page) {
    this.page = page
    this.ospGreetingBox = page.getByTestId('osp-greeting-box')
    this.ospGreetingBoxHeadline = page.getByTestId('osp-greeting-box-headline')
    this.ospOrderData = page.getByTestId('osp-order-data')
    this.ospPaymentData = page.getByTestId('osp-payment-data')
    this.ospDeliveryAddress = page.getByTestId('osp-delivery-address')
    this.ospBillingAddress = page.getByTestId('osp-billing-address')
    this.ospContinueShoppingButton = page.getByTestId(
      'osp-continue-shopping-button',
    )
    this.ospOrderDetailsButton = page.getByTestId('osp-order-details-button')
    this.ospDeliveryDate = page.getByTestId('osp-delivery-date')
    this.ospCarrier = page.getByTestId('osp-carrier')
    this.ospProductCard = page.getByTestId('order-detail-product-card')
    this.ospProductImage = page.getByTestId('order-detail-product-image')
    this.ospProductBrand = page.getByTestId('order-detail-product-brand')
    this.ospProductName = page.getByTestId('order-detail-product-name')
    this.ospProductColor = page.getByTestId('order-detail-product-color')
    this.ospProductSize = page.getByTestId('order-detail-product-size')
    this.ospProductQuantity = page.getByTestId('order-detail-product-quantity')
    this.ospSubtotal = page.getByTestId('order-detail-subtotal')
    this.ospShippingCost = page.getByTestId('order-detail-shipping-cost')
    this.ospTotal = page.getByTestId('order-detail-total')
    this.ospProductPrice = page.getByTestId('price')
    this.ospEmptyStateContainer = page.getByTestId('empty-state')
    this.ospEmptyStateIcon = page.getByTestId('empty-state-icon')
    this.ospEmptyStateHeadline = page.getByTestId('empty-state-headline')
    this.ospEmptyStateSubheadline = page.getByTestId('empty-state-subheadline')
    this.ospEmptyStateContinueShoppingButton = page.locator(
      '[data-testid="empty-state"] >> a',
    )
  }

  async assertOspPriceSummary(
    subtotalPrice: Locator,
    shippingCost: Locator,
    totalPrice: Locator,
  ) {
    const subtotalPriceLabel = await subtotalPrice.textContent()
    const shippingCostLabel = await shippingCost.textContent()
    const totalPriceLabel = await totalPrice.textContent()

    const subtotalPriceValue = parseFloat(
      subtotalPriceLabel?.replace(/[^0-9.-]+/g, '') ?? '0',
    )
    const shippingCostValue = parseFloat(
      shippingCostLabel?.replace(/[^0-9.-]+/g, '') ?? '0',
    )
    const totalPriceValue = parseFloat(
      totalPriceLabel?.replace(/[^0-9.-]+/g, '') ?? '0',
    )

    expect(totalPriceValue).toEqual(subtotalPriceValue + shippingCostValue)
  }
}
