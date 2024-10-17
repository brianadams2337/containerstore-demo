import type {
  AutomaticDiscountEffect,
  Promotion,
  RFC33339Date,
} from '@scayle/storefront-nuxt'
import { Factory } from 'fishery'

export const promotionFactory = Factory.define<Promotion>(() => ({
  id: '66951014684cc17335766006',
  name: 'Automatic discount',
  schedule: {
    from: '2024-07-15T10:00:00Z' as RFC33339Date,
    to: '2025-04-01T10:00:00Z' as RFC33339Date,
  },
  isActive: true,
  effect: {
    type: 'automatic_discount',
    additionalData: {
      type: 'relative',
      value: 10,
    },
  } as AutomaticDiscountEffect,
  conditions: [
    {
      level: 'global',
      key: 'panels_automatic-discount_any_products_condition_e5b66afa5eacabdb6bb855c6a9344db49cc372b4',
      condition: 'size(payload.items) \u003E= 1',
    },
    {
      level: 'global',
      key: 'panels_automatic-discount_minimum_order_amount_10000',
      condition: 'payload.totals.withTax \u003E= 10000',
    },
  ],
  customData: {
    product: {
      badgeLabel: 'Get -10% Off',
      promotionId: 2476,
    },
    terms:
      'The promotion applies to Jackets products. If you buy 1 or more jacket products that are worth over 100€, you will get 10% discount on your order. The promotion lasts till the end of April 1st, 2024.',
    category: {
      ctaLabel: 'Jacket Deals',
      id: 50353,
    },
    colorHex: '#a4c639',
    corePanel: {
      viewType: 'automatic-discount',
    },
    headlineParts: [
      'Autumn Jacket Campaign',
      'Buy jacket(s) worth 100€ & get 10% on it',
    ],
    minOrderValue: 10000,
  },
  priority: 1,
}))
