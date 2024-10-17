import { it, describe, expect } from 'vitest'
import type {
  BasketItem,
  BasketResponseData,
  CentAmount,
  RFC33339Date,
} from '@scayle/storefront-nuxt'
import type { BasketKey } from '@scayle/storefront-api'
import {
  bundleBasketItemsByGroup,
  getBasketTotalWithoutPromotions,
  getPartitionedBasketItems,
  sortBasketItemsByIsSoldOut,
  sortBasketItemsByNameAndSize,
} from './basket'

const getBasketItemData = (): BasketItem[] => [
  {
    itemGroup: undefined,
    key: 'key1',
    packageId: 1,
    quantity: 1,
    status: 'available',
    displayData: {},
    availableQuantity: 1,
    customData: {},
    price: {
      total: {
        currencyCode: 'EUR',
        withTax: 2790 as CentAmount,
        withoutTax: 1395 as CentAmount,
        appliedReductions: [],
      },
      unit: {
        currencyCode: 'EUR',
        withTax: 2790 as CentAmount,
        withoutTax: 1395 as CentAmount,
        appliedReductions: [],
      },
    },
    variant: {
      id: 323243,
      referenceKey: 'Ado9cis001000001',
      attributes: {
        size: {
          id: 1001,
          key: 'size',
          label: 'Größe',
          type: 'size',
          multiSelect: false,
          values: {
            id: 2370,
            label: 'OSFW',
            value: 'osfw',
          },
        },
      },
      createdAt: '2024-07-13T08:22:22+00:00' as RFC33339Date,
      updatedAt: '2024-08-06T14:41:47+00:00' as RFC33339Date,
      stock: {
        supplierId: 3,
        warehouseId: 58,
        quantity: 1,
        isSellableWithoutStock: false,
      },
      price: {
        currencyCode: 'EUR',
        withTax: 2790 as CentAmount,
        withoutTax: 1395 as CentAmount,
        tax: {
          vat: {
            amount: 1395 as CentAmount,
            rate: 0.999999,
          },
        },
        appliedReductions: [],
      },
    },
    product: {
      id: 206051,
      isActive: true,
      isSoldOut: false,
      isNew: false,
      createdAt: '2024-07-13T08:22:22+00:00',
      updatedAt: '2024-07-13T11:29:38+00:00',
      attributes: {
        name: {
          id: 20005,
          key: 'name',
          label: 'Name',
          type: '',
          multiSelect: false,
          values: {
            id: 20005,
            label: 'Cap',
            value: 'name',
          },
        },
      },
      images: [
        {
          hash: 'images/05f73309512f614e158ea03d70b5b588.png',
        },
      ],
      variants: [
        {
          id: 323243,
          attributes: {
            size: {
              id: 1001,
              key: 'size',
              label: 'Größe',
              type: 'size',
              multiSelect: false,
              values: {
                id: 2370,
                label: 'OSFW',
                value: 'osfw',
              },
            },
          },
          createdAt: '2024-07-13T08:22:22+00:00' as RFC33339Date,
          updatedAt: '2024-08-06T14:41:47+00:00' as RFC33339Date,
          stock: {
            supplierId: 3,
            warehouseId: 58,
            quantity: 1,
            isSellableWithoutStock: false,
          },
          price: {
            currencyCode: 'EUR',
            withTax: 2790 as CentAmount,
            withoutTax: 1395 as CentAmount,
            tax: {
              vat: {
                amount: 1395 as CentAmount,
                rate: 0.999999,
              },
            },
            appliedReductions: [],
          },
          lowestPriorPrice: {
            withTax: null,
            relativeDifferenceToPrice: null,
          },
        },
        {
          id: 323244,
          attributes: {
            size: {
              id: 1001,
              key: 'size',
              label: 'Größe',
              type: 'size',
              multiSelect: false,
              values: {
                id: 2368,
                label: 'OSFM',
                value: 'osfm',
              },
            },
          },
          createdAt: '2024-07-13T08:22:22+00:00' as RFC33339Date,
          updatedAt: '2024-08-06T14:41:47+00:00' as RFC33339Date,
          stock: {
            supplierId: 3,
            warehouseId: 58,
            quantity: 10,
            isSellableWithoutStock: false,
          },
          price: {
            currencyCode: 'EUR',
            withTax: 2790 as CentAmount,
            withoutTax: 1395 as CentAmount,
            tax: {
              vat: {
                amount: 1395 as CentAmount,
                rate: 0.999999,
              },
            },
            appliedReductions: [],
          },
          lowestPriorPrice: {
            withTax: null,
            relativeDifferenceToPrice: null,
          },
        },
      ],
    },
  },
  {
    itemGroup: undefined,
    key: 'key2',
    packageId: 1,
    quantity: 5,
    status: 'available',
    displayData: {},
    availableQuantity: 557,
    customData: {},
    price: {
      total: {
        currencyCode: 'EUR',
        withTax: 15000 as CentAmount,
        withoutTax: 7500 as CentAmount,
        appliedReductions: [],
      },
      unit: {
        currencyCode: 'EUR',
        withTax: 3000 as CentAmount,
        withoutTax: 1500 as CentAmount,
        appliedReductions: [],
      },
    },
    variant: {
      id: 323196,
      referenceKey: 'IX7485-500',
      attributes: {
        size: {
          id: 1001,
          key: 'size',
          label: 'Größe',
          type: 'size',
          multiSelect: false,
          values: {
            id: 2365,
            label: 'One Size',
            value: 'one_size',
          },
        },
      },
      createdAt: '2024-07-13T08:10:43+00:00' as RFC33339Date,
      updatedAt: '2024-08-06T14:41:47+00:00' as RFC33339Date,
      stock: {
        supplierId: 3,
        warehouseId: 58,
        quantity: 557,
        isSellableWithoutStock: false,
      },
      price: {
        currencyCode: 'EUR',
        withTax: 3000 as CentAmount,
        withoutTax: 1500 as CentAmount,
        tax: {
          vat: {
            amount: 1500 as CentAmount,
            rate: 0.999999,
          },
        },
        appliedReductions: [],
      },
    },
    product: {
      id: 206037,
      isActive: true,
      isSoldOut: false,
      isNew: false,
      createdAt: '2024-07-13T08:10:43+00:00',
      updatedAt: '2024-07-13T11:34:26+00:00',
      attributes: {
        name: {
          id: 20005,
          key: 'name',
          label: 'Name',
          type: '',
          multiSelect: false,
          values: {
            id: 20005,
            label: "Umhängetasche 'Adicolor Classic'",
            value: 'name',
          },
        },
        color: {
          id: 1000,
          key: 'color',
          label: 'Farbe',
          type: '',
          multiSelect: true,
          values: [
            {
              id: 2297,
              label: 'Gelb',
              value: 'gelb',
            },
          ],
        },
      },
      images: [
        {
          hash: 'images/bf13058752c7965e3ac25fb39780e6b1.jpg',
          attributes: {},
        },
      ],
      variants: [
        {
          id: 323196,
          referenceKey: 'IX7485-500',
          attributes: {
            size: {
              id: 1001,
              key: 'size',
              label: 'Größe',
              type: 'size',
              multiSelect: false,
              values: {
                id: 2365,
                label: 'One Size',
                value: 'one_size',
              },
            },
          },
          createdAt: '2024-07-13T08:10:43+00:00' as RFC33339Date,
          updatedAt: '2024-08-06T14:41:47+00:00' as RFC33339Date,
          stock: {
            supplierId: 3,
            warehouseId: 58,
            quantity: 557,
            isSellableWithoutStock: false,
          },
          price: {
            currencyCode: 'EUR',
            withTax: 3000 as CentAmount,
            withoutTax: 1500 as CentAmount,
            tax: {
              vat: {
                amount: 1500 as CentAmount,
                rate: 0.999999,
              },
            },
            appliedReductions: [],
          },
          lowestPriorPrice: {
            withTax: null,
            relativeDifferenceToPrice: null,
          },
        },
      ],
    },
  },
  {
    itemGroup: undefined,
    key: 'key3',
    packageId: 1,
    quantity: 1,
    status: 'available',
    displayData: {},
    availableQuantity: 168,
    customData: {},
    price: {
      total: {
        currencyCode: 'EUR',
        withTax: 7500 as CentAmount,
        withoutTax: 3750 as CentAmount,
        appliedReductions: [],
      },
      unit: {
        currencyCode: 'EUR',
        withTax: 7500 as CentAmount,
        withoutTax: 3750 as CentAmount,
        appliedReductions: [],
      },
    },
    variant: {
      id: 323210,
      referenceKey: 'IX6836-500',
      attributes: {
        size: {
          id: 1001,
          key: 'size',
          label: 'Größe',
          type: 'size',
          multiSelect: false,
          values: {
            id: 2365,
            label: 'One Size',
            value: 'one_size',
          },
        },
      },
      createdAt: '2024-07-13T08:19:50+00:00' as RFC33339Date,
      updatedAt: '2024-08-06T14:41:47+00:00' as RFC33339Date,
      stock: {
        supplierId: 3,
        warehouseId: 58,
        quantity: 168,
        isSellableWithoutStock: false,
      },
      price: {
        currencyCode: 'EUR',
        withTax: 7500 as CentAmount,
        withoutTax: 3750 as CentAmount,
        tax: {
          vat: {
            amount: 3750 as CentAmount,
            rate: 0.999999,
          },
        },
        appliedReductions: [],
      },
    },
    product: {
      id: 206042,
      isActive: true,
      isSoldOut: false,
      isNew: false,
      createdAt: '2024-07-13T08:19:50+00:00',
      updatedAt: '2024-07-13T11:36:21+00:00',
      attributes: {
        name: {
          id: 20005,
          key: 'name',
          label: 'Name',
          type: '',
          multiSelect: false,
          values: {
            id: 20005,
            label: 'Sporthose',
            value: 'name',
          },
        },
      },
      images: [
        {
          hash: 'images/820d29b14e449708da1fab28da4295c1.jpg',
          attributes: {},
        },
      ],
      variants: [
        {
          id: 323210,
          referenceKey: 'IX6836-500',
          attributes: {
            size: {
              id: 1001,
              key: 'size',
              label: 'Größe',
              type: 'size',
              multiSelect: false,
              values: {
                id: 2365,
                label: 'One Size',
                value: 'one_size',
              },
            },
          },
          createdAt: '2024-07-13T08:19:50+00:00' as RFC33339Date,
          updatedAt: '2024-08-06T14:41:47+00:00' as RFC33339Date,
          stock: {
            supplierId: 3,
            warehouseId: 58,
            quantity: 168,
            isSellableWithoutStock: false,
          },
          price: {
            currencyCode: 'EUR',
            withTax: 7500 as CentAmount,
            withoutTax: 3750 as CentAmount,
            tax: {
              vat: {
                amount: 3750 as CentAmount,
                rate: 0.999999,
              },
            },
            appliedReductions: [],
          },
          lowestPriorPrice: {
            withTax: null,
            relativeDifferenceToPrice: null,
          },
        },
      ],
    },
  },
]

describe('sortBasketItemsByNameAndSize', () => {
  it('should sort basket items by name and size', () => {
    const basketItems = getBasketItemData()
    const result = sortBasketItemsByNameAndSize(basketItems)

    // Verify original order of basket items
    expect(basketItems[0].product.id).toBe(206051)
    expect(basketItems[1].product.id).toBe(206037)
    expect(basketItems[2].product.id).toBe(206042)

    // Verify sorted order of basket items
    expect(result[0].product.id).toBe(206042)
    expect(result[1].product.id).toBe(206037)
    expect(result[2].product.id).toBe(206051)
  })
})

describe('sortBasketItemsByIsSoldOut', () => {
  it('should sort by sold out items to beginning of list', () => {
    const basketItems = getBasketItemData()
    basketItems[0].product.isSoldOut = false
    basketItems[1].product.isSoldOut = true
    basketItems[2].product.isSoldOut = false

    const result = sortBasketItemsByIsSoldOut(basketItems)

    expect(result[0].product.id).toBe(206051)
    expect(result[0].product.isSoldOut).toBe(false)

    expect(result[1].product.id).toBe(206042)
    expect(result[1].product.isSoldOut).toBe(false)

    expect(result[2].product.id).toBe(206037)
    expect(result[2].product.isSoldOut).toBe(true)
  })
})

describe('getPartitionedBasketItems', () => {
  it('should return a object with basket items split into standAlone and groupedItems', () => {
    const basketItems = getBasketItemData()
    basketItems[0].itemGroup = {
      id: 'itemGroupId-1',
      isMainItem: true,
      isRequired: true,
    }
    basketItems[1].itemGroup = {
      id: 'itemGroupId-1',
      isMainItem: false,
      isRequired: true,
    }

    const result = getPartitionedBasketItems(basketItems)

    expect(Object.keys(result)).toEqual(['standAlone', 'groupedItems'])

    expect(result['standAlone'].length).toBe(1)
    expect(result['groupedItems'].length).toBe(2)

    expect(result['standAlone'][0].product.id).toBe(206042)
    expect(result['groupedItems'][0].product.id).toBe(206051)
    expect(result['groupedItems'][1].product.id).toBe(206037)
  })
})

describe('bundleBasketItemsByGroup', () => {
  it('should return items bundled by group', () => {
    const basketItems = getBasketItemData()

    basketItems[0].itemGroup = {
      id: 'itemGroupId-1',
      isMainItem: true,
      isRequired: true,
    }
    basketItems[1].itemGroup = {
      id: 'itemGroupId-2',
      isMainItem: true,
      isRequired: true,
    }
    basketItems[2].itemGroup = {
      id: 'itemGroupId-1',
      isMainItem: false,
      isRequired: true,
    }

    const result = bundleBasketItemsByGroup(basketItems)

    expect(Object.keys(result)).toEqual(['itemGroupId-1', 'itemGroupId-2'])

    expect(result['itemGroupId-1']![0].product.id).toBe(206051)
    expect(result['itemGroupId-1']![1].product.id).toBe(206042)
    expect(result['itemGroupId-2']![0].product.id).toBe(206037)
  })
})

describe('getBasketTotalWithoutPromotions', () => {
  it('should return total without promotions', () => {
    const basket: BasketResponseData = {
      key: 'basket-key' as BasketKey,
      cost: {
        withTax: 1000 as CentAmount,
        withoutTax: 1200 as CentAmount,
        appliedReductions: [
          {
            category: 'promotion',
            type: 'absolute',
            amount: {
              relative: 500,
              absoluteWithTax: 500 as CentAmount,
            },
          },
          {
            category: 'campaign',
            type: 'absolute',
            amount: {
              relative: 200,
              absoluteWithTax: 200 as CentAmount,
            },
          },
        ],

        currencyCode: 'EUR',
      },
      currencyCode: 'EUR',
      items: getBasketItemData(),
      packages: [
        {
          id: 1,
          carrierKey: 'test',
          deliveryDate: {
            max: new Date().toISOString(),
            min: new Date().toISOString(),
          },
        },
      ],
      applicablePromotions: [],
    }

    const totalWithoutPromotions = getBasketTotalWithoutPromotions(basket)

    expect(totalWithoutPromotions).toEqual(1500)
  })

  it('should return zero if no basket data provided', () => {
    expect(getBasketTotalWithoutPromotions()).toEqual(0)
  })
})
