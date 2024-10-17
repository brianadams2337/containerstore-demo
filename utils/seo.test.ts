import { it, describe } from 'vitest'
import {
  sanitizeCanonicalURL,
  generateProductSchema,
  generateCategoryBreadcrumbSchema,
} from './seo'
import { variantFactory } from '~/test/factories/variant'

describe('sanitizeCanonicalURL', () => {
  it('returns URL with stripped params except "page" by default', ({
    expect,
  }) => {
    const url =
      'https://localhost:3000/de/c/frauen-50337?sort=price_desc&page=2&filters[color]=2275'
    const preparedUrl = sanitizeCanonicalURL(url)
    expect(preparedUrl).toEqual(
      'https://localhost:3000/de/c/frauen-50337?page=2',
    )
  })

  it('returns URL with stripped params except provided whitelisted params', ({
    expect,
  }) => {
    const url =
      'https://localhost:3000/de/c/frauen-50337?sort=price_desc&page=2&filters[color]=2275'
    const preparedUrl = sanitizeCanonicalURL(url, ['page', 'sort'])
    expect(preparedUrl).toEqual(
      'https://localhost:3000/de/c/frauen-50337?sort=price_desc&page=2',
    )
  })

  it('returns the same URL if no query params', ({ expect }) => {
    const url = 'https://localhost:3000/de/c/frauen-50337'
    const preparedUrl = sanitizeCanonicalURL(url)
    expect(preparedUrl).toEqual('https://localhost:3000/de/c/frauen-50337')
  })
})

describe('generateProductSchema', () => {
  it('return generated product schema with mandatory payload defined only', ({
    expect,
  }) => {
    const schema = generateProductSchema({
      productName: 'Test product',
      brandName: 'Hugo',
      description: 'product description',
      url: '/p/sweatshirt-ess-206056',
      variants: [
        variantFactory.build({
          id: 1,
          referenceKey: 'refKey',
          price: {
            withTax: 1050,
            currencyCode: 'EUR',
          },
          stock: {
            quantity: 0,
          },
        }),
      ],
    })

    expect(schema).toEqual({
      '@context': 'https://schema.org',
      '@type': 'Product',
      url: '/p/sweatshirt-ess-206056',
      name: 'Test product',
      description: 'product description',
      image: [],
      brand: { '@type': 'Brand', name: 'Hugo' },
      offers: [
        {
          '@type': 'Offer',
          priceCurrency: 'EUR',
          price: 10.5,
          availability: 'https://schema.org/OutOfStock',
          itemCondition: 'https://schema.org/NewCondition',
          mpn: 'refKey',
          sku: '1',
        },
      ],
    })
  })

  it('return generated product schema with optional payload defined', ({
    expect,
  }) => {
    const schema = generateProductSchema({
      productName: 'Test product',
      description: 'product description',
      brandName: 'Hugo',
      variants: [
        variantFactory.build({
          id: 1,
          referenceKey: 'refKey',
          price: {
            withTax: 1050,
            currencyCode: 'USD',
          },
          stock: {
            quantity: 10,
          },
        }),
      ],
      url: '/p/sweatshirt-ess-206056',
      images: ['images/fe8ee645c772b98de23b00e4f600a613.png'],
    })

    expect(schema).toEqual({
      '@context': 'https://schema.org',
      '@type': 'Product',
      url: '/p/sweatshirt-ess-206056',
      name: 'Test product',
      description: 'product description',
      image: ['images/fe8ee645c772b98de23b00e4f600a613.png'],
      brand: { '@type': 'Brand', name: 'Hugo' },
      offers: [
        {
          '@type': 'Offer',
          priceCurrency: 'USD',
          price: 10.5,
          availability: 'https://schema.org/InStock',
          itemCondition: 'https://schema.org/NewCondition',
          mpn: 'refKey',
          sku: '1',
        },
      ],
    })
  })
})

describe('generateCategoryBreadcrumbSchema', () => {
  it('return generated category breadcrumb schema', ({ expect }) => {
    const schema = generateCategoryBreadcrumbSchema([
      { to: '/de/c/women/clothing/shirts-2045', value: 'shirts' },
      { to: '/de/c/women/clothing-2048', value: 'clothing' },
      { to: '/de/c/women-1', value: 'women' },
    ])

    expect(schema).toEqual({
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: 'shirts',
          item: '/de/c/women/clothing/shirts-2045',
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: 'clothing',
          item: '/de/c/women/clothing-2048',
        },
        {
          '@type': 'ListItem',
          position: 3,
          name: 'women',
          item: '/de/c/women-1',
        },
      ],
    })
  })
})
