import { Factory } from 'fishery'
import {
  attributeGroupMultiFactory,
  attributeGroupSingleFactory,
} from '@scayle/storefront-nuxt/test/factories'
import type { CentAmount } from '@scayle/storefront-nuxt'
import type {
  OrderVariant,
  OrderProduct,
  Order,
  OrderItem,
  OrderAdvancedAttribute,
  OrderCategory,
} from '~/types/order'

// TODO: Extract order factories within this file to the `storefront-core`
export const orderCategoryFactory = Factory.define<OrderCategory>(() => ({
  categoryId: 1,
  categoryName: 'Frauen',
  categoryHidden: false,
  categoryUrl: '/frauen',
  categorySlug: 'frauen',
}))

export const orderAdvancedAttributeFactory =
  Factory.define<OrderAdvancedAttribute>(() => ({
    key: 'orderAttribute',
    label: 'Order advanced attribute',
    values: [
      {
        fieldSet: [
          [
            {
              value: 'Order',
            },
          ],
        ],
        groupSet: [
          {
            fieldSet: [
              [
                {
                  value: 'Attribute value',
                },
              ],
            ],
            groupSet: [],
          },
        ],
      },
    ],
  }))

export const orderProductFactory = Factory.define<OrderProduct>(() => ({
  id: 1,
  advancedAttributes: {
    advColor: orderAdvancedAttributeFactory.build({ key: 'advColor' }),
    productName: orderAdvancedAttributeFactory.build({
      key: 'productName',
    }),
  },
  attributes: {
    brand: attributeGroupSingleFactory.build({ key: 'brand' }),
    brandLogo: attributeGroupSingleFactory.build({ key: 'brandLogo' }),
    category: attributeGroupMultiFactory.build({ key: 'category' }),
    color: attributeGroupSingleFactory.build({ key: 'color' }),
    colorHex: attributeGroupSingleFactory.build({ key: 'colorHex' }),
    name: attributeGroupSingleFactory.build({ key: 'name' }),
    description: attributeGroupSingleFactory.build({
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
}))

export const orderVariantFactory = Factory.define<OrderVariant>(() => ({
  id: 1,
  attributes: {
    size: attributeGroupSingleFactory.build({ key: 'size' }),
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
}))

export const orderItemFactory = Factory.define<OrderItem>(() => ({
  id: '1234',
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
  packageId: 1,
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
  product: orderProductFactory.build({ id: 1 }),
  variant: orderVariantFactory.build({ id: 1 }),
  reservationKey: '6nq69bzzkd5xufxliwg8',
  status: 'available',
  createdAt: '2018-01-20T09:30:15+00:00',
  updatedAt: '2018-01-20T09:30:15+00:00',
}))

export const orderFactory = Factory.define<Order>(() => ({
  id: 1,
  detailedStatus: {
    order: {
      code: 'order_open',
      name: 'Order open',
    },
    shipping: {
      code: 'shipping_open',
      name: 'Shipping open',
    },
    billing: {
      code: 'billing_open',
      name: 'Billing open',
    },
  },
  address: {
    billing: {
      id: 998,
      additional: 'c/o SCAYLE',
      city: 'Hamburg',
      countryCode: 'DEU',
      houseNumber: '12',
      isDefault: {
        billing: false,
        shipping: false,
      },
      recipient: {
        firstName: 'Anna',
        gender: 'm',
        lastName: 'Fischer',
        type: 'personal',
      },
      referenceKey:
        'InGidcPDmL8fGkv02a3sSAgAr7ySMBfa66iw4MriYgUNI3Boq369rBOZW3stlKLWSqIjB2dXCGNbCxoM5Xww4cI8cULUoGBFJHH0',
      street: 'Wolfgangsweg',
      zipCode: '20459',
      createdAt: '2018-11-29T05:20:13+01:00',
      updatedAt: '2018-11-29T05:20:13+01:00',
    },
    forward: {
      additional: 'c/o SCAYLE',
      city: 'Hamburg',
      countryCode: 'DEU',
      houseNumber: '12',
      recipient: {
        firstName: 'Anna',
        gender: 'm',
        lastName: 'Fischer',
        type: 'personal',
      },
      street: 'Wolfgangsweg',
      zipCode: '20459',
      createdAt: '2018-11-29T05:20:13+01:00',
      updatedAt: '2018-11-29T05:20:13+01:00',
    },
    shipping: {
      id: 998,
      city: 'Hamburg',
      collectionPoint: {
        customerKey: 'bced-234-234',
        description: "Pedro's Kiosk",
        key: '12345-a',
        type: 'hermes_parcelshop',
      },
      countryCode: 'DEU',
      houseNumber: '10',
      isDefault: {
        billing: false,
        shipping: true,
      },
      recipient: {
        firstName: 'Anna',
        gender: 'm',
        lastName: 'Fischer',
        type: 'personal',
      },
      referenceKey:
        'InGidcPDmL8fGkv02a3sSAgAr7ySMBfa66iw4MriYgUNI3Boq369rBOZW3stlKLWSqIjB2dXCGNbCxoM5Xww4cI8cULUoGBFJHH0',
      street: 'Domstrasse',
      zipCode: '20459',
      createdAt: '2018-11-29T05:20:13+01:00',
      updatedAt: '2018-11-29T05:20:13+01:00',
    },
  },
  basketKey: 'basket-c6v7k4eer1',
  confirmedAt: '2018-01-20T11:30:15+00:00',
  cost: {
    appliedFees: [
      {
        amount: {
          withoutTax: 168 as CentAmount,
          withTax: 200 as CentAmount,
        },
        category: 'delivery',
        key: 'hermes',
        option: 'express',
      },
      {
        amount: {
          withoutTax: 168 as CentAmount,
          withTax: 200 as CentAmount,
        },
        category: 'payment',
        key: 'computop_creditcard',
      },
      {
        amount: {
          withoutTax: 168 as CentAmount,
          withTax: 200 as CentAmount,
        },
        category: 'payment',
        key: 'computop_creditcard',
        option: 'paybreak',
      },
    ],
    appliedReductions: [
      {
        amount: {
          absoluteWithTax: 100 as CentAmount,
          relative: 0.5,
        },
        category: 'voucher',
        type: 'absolute',
      },
    ],
    tax: {},
    withoutTax: 1168 as CentAmount,
    withTax: 1390 as CentAmount,
  },
  currencyCode: 'EUR',
  customData: {
    score: {
      generatedOn: '2018-05-20T19:45:15+00:00',
      result: 'green',
    },
  },
  customer: {
    id: 9876,
    authentication: {
      type: 'password',
    },
    birthDate: '1981-02-02',
    customData: {
      score: {
        generatedOn: '2018-05-20T19:45:15+00:00',
        result: 'green',
      },
    },
    email: 'anna.fischer@scayle.com',
    firstName: 'Anna',
    gender: 'f',
    groups: ['employee'],
    lastName: 'Fischer',
    phone: '0049/1234567890',
    publicKey: '666',
    referenceKey:
      'InGidcPDmL8fGkv02a3sSAgAr7ySMBfa66iw4MriYgUNI3Boq369rBOZW3stlKLWSqIjB2dXCGNbCxoM5Xww4cI8cULUoGBFJHH0',
    status: {
      isActive: true,
      isGuestCustomer: false,
      isTestCustomer: false,
    },
    title: 'Prof.',
    type: 'personal',
    createdAt: '2018-01-20T09:30:15+00:00',
    updatedAt: '2018-01-20T09:30:15+00:00',
  },
  invoicedAt: '2018-01-22T11:30:15+00:00',
  items: [orderItemFactory.build()],
  packages: [
    {
      id: 1,
      carrierKey: 'dhl',
      deliveryDate: {
        maximum: '2018-02-05',
        minimum: '2018-02-02',
      },
      deliveryStatus: 'open',
      shipmentKey: 'shpmnt-123',
    },
  ],
  payment: [
    {
      amount: 1190,
      data: {
        CCBrand: 'VISA',
        CCExpiry: '202005',
        IPCity: 'charlottenburg',
        IPLatitude: '52.5151',
        IPLongitude: '13.3053',
        IPState: 'berlin',
        IPZone: '276',
        IPZoneA2: 'de',
      },
      key: 'computop_creditcard',
      transactionKey: 'creditcard-abcde',
    },
  ],
  publicKey: '666',
  referenceKey:
    'InGidcPDmL8fGkv02a3sSAgAr7ySMBfa66iw4MriYgUNI3Boq369rBOZW3stlKLWSqIjB2dXCGNbCxoM5Xww4cI8cULUoGBFJHH0',
  shipping: {
    policy: 'least_packages',
  },
  shop: {
    id: 139,
    country: 'DEU',
    language: 'de',
  },
  status: 'invoice_completed',
  vouchers: [
    {
      id: 198234,
      code: 'fashion2020',
      type: 'absolute',
      value: 1000,
    },
  ],
  createdAt: '2018-01-20T09:30:15+00:00',
  updatedAt: '2018-01-20T09:30:15+00:00',
}))
