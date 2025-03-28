import { describe, expect, it } from 'vitest'
import type { CentAmount } from '@scayle/storefront-core'
import { getOrderDeliveries, mapAttributes } from './order'
import type { OrderItems, Package } from '~/types/order'
import {
  orderFactory,
  orderCategoryFactory,
  attributeMultiGroupFactory,
  orderAdvancedAttributeFactory,
  attributeSingleGroupFactory,
} from '~/test/factories/order'

describe('getOrderDeliveries', () => {
  it('should get order deliveries with items and shipment data', () => {
    const packageId = 1
    const items = [
      {
        availableQuantity: 20,
        customData: {
          key: 'value',
        },
        deliveryForecast: {
          subsequentDelivery: {
            key: 'christmas',
          },
        },
        key: 'ac834d23e689u678',
        packageId,
        price: {
          appliedReductions: [
            {
              amount: {
                absoluteWithTax: 100 as CentAmount,
                relative: 0.5,
              },
              category: 'sale',
              type: 'relative',
            },
          ],
          reference: {
            size: '100',
            unit: 'ml',
            withTax: 595,
          },
          tax: {
            vat: {
              amount: 190,
              rate: 0.19,
            },
          },
          undiscountedWithOutTax: 1000,
          undiscountedWithTax: 1190,
          withoutTax: 1000 as CentAmount,
          withTax: 1190 as CentAmount,
        },
        product: {
          id: 1,
          advancedAttributes: {
            advColor: orderAdvancedAttributeFactory.build({ key: 'advColor' }),
            productName: orderAdvancedAttributeFactory.build({
              key: 'productName',
            }),
          },
          attributes: {
            brand: attributeSingleGroupFactory.build({ key: 'brand' }),
            brandLogo: attributeSingleGroupFactory.build({ key: 'brandLogo' }),
            category: attributeMultiGroupFactory.build({ key: 'category' }),
            color: attributeSingleGroupFactory.build({ key: 'color' }),
            colorHex: attributeSingleGroupFactory.build({ key: 'colorHex' }),
            name: attributeSingleGroupFactory.build({ key: 'name' }),
            description: attributeSingleGroupFactory.build({
              key: 'description',
            }),
          },
          categories: [[orderCategoryFactory.build({ categoryId: 1 })]],
          images: [
            {
              hash: '9f6c628a98106dcce2bc5a4ac1de9c14',
            },
          ],
          masterKey: '480306626-1',
          name: 'Chelsea Boots',
          createdAt: '2018-01-20T09:30:15+00:00',
          updatedAt: '2018-01-20T09:30:15+00:00',
        },
        reservationKey: '6nq69bzzkd5xufxliwg8',
        status: 'available',
        variant: {
          id: 1,
          attributes: {
            size: attributeSingleGroupFactory.build({ key: 'size' }),
          },
          images: [
            {
              hash: '9f6c628a98106dcce2bc5a4ac1de9c14',
            },
          ],
          referenceKey: '563843898',
          stock: {
            warehouseId: 1,
            isSellableWithoutStock: false,
            quantity: 18,
            supplierId: 271,
          },
          createdAt: '2018-01-20T09:30:15+00:00',
          updatedAt: '2018-01-20T09:30:15+00:00',
          lowestPriorPrice: {
            withTax: 23 as CentAmount,
            relativeDifferenceToPrice: 24,
          },
        },
        createdAt: '2018-01-20T09:30:15+00:00',
        updatedAt: '2018-01-20T09:30:15+00:00',
      },
    ] as OrderItems

    const shipment: Package = {
      id: packageId,
      carrierKey: 'dhl',
      deliveryDate: { maximum: '2018-02-05', minimum: '2018-02-02' },
      deliveryStatus: 'open',
      shipmentKey: 'shpmnt-123',
    }

    const order = orderFactory.build({
      items,
      packages: [shipment],
    })
    const deliveries = getOrderDeliveries(order)

    expect(deliveries).toStrictEqual({
      '1': { items, shipment },
    })
  })

  it('should receive an empty object if no order items', () => {
    const deliveries = getOrderDeliveries(
      orderFactory.build({ items: undefined }),
    )
    expect(deliveries).toStrictEqual({})
  })
})

describe('mapAttributes', () => {
  it('should map attributes for order product', () => {
    const attributes = mapAttributes({
      brand: attributeSingleGroupFactory.build({ key: 'brand' }),
      brandLogo: attributeSingleGroupFactory.build({ key: 'brandLogo' }),
      category: attributeMultiGroupFactory.build({ key: 'category' }),
      color: attributeSingleGroupFactory.build({ key: 'color' }),
      colorHex: attributeSingleGroupFactory.build({ key: 'colorHex' }),
      name: attributeSingleGroupFactory.build({ key: 'name' }),
      description: attributeSingleGroupFactory.build({
        key: 'description',
      }),
    })

    expect(attributes).toStrictEqual({
      brand: {
        id: null,
        key: 'brand',
        label: 'Test Attribute',
        type: null,
        multiSelect: false,
        values: {
          label: 'Test Attribute',
        },
      },
      brandLogo: {
        id: null,
        key: 'brandLogo',
        label: 'Test Attribute',
        type: null,
        multiSelect: false,
        values: {
          label: 'Test Attribute',
        },
      },
      category: {
        id: null,
        key: 'category',
        label: 'Test Attribute',
        type: null,
        multiSelect: true,
        values: [
          {
            label: 'Test Attribute',
          },
        ],
      },
      color: {
        id: null,
        key: 'color',
        label: 'Test Attribute',
        type: null,
        multiSelect: false,
        values: {
          label: 'Test Attribute',
        },
      },
      colorHex: {
        id: null,
        key: 'colorHex',
        label: 'Test Attribute',
        type: null,
        multiSelect: false,
        values: {
          label: 'Test Attribute',
        },
      },
      name: {
        id: null,
        key: 'name',
        label: 'Test Attribute',
        type: null,
        multiSelect: false,
        values: {
          label: 'Test Attribute',
        },
      },
      description: {
        id: null,
        key: 'description',
        label: 'Test Attribute',
        type: null,
        multiSelect: false,
        values: {
          label: 'Test Attribute',
        },
      },
    })
  })
})
