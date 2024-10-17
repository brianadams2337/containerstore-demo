import { it, describe, expect } from 'vitest'
import type { Attributes } from '@scayle/storefront-nuxt'
import {
  getFilteredAttributeGroups,
  getAdvancedAttributes,
} from '~/utils/attribute'
import {
  advancedAttributeFactory,
  attributeGroupFactory,
} from '~/test/factories/attribute'
import { productFactory } from '~/test/factories/product'

describe('attribute', () => {
  describe('getFilteredAttributeGroups', () => {
    it('should return correct filtered and formatted attributes', () => {
      const attributes = {
        design: attributeGroupFactory.build({
          type: 'design',
          label: 'Jackenart',
          values: { id: 2534, label: 'Bomberjacke', value: 'bomberjacke' },
        }),
        extras: attributeGroupFactory.build({
          label: 'Extras',
          type: 'extras',
          multiSelect: true,
          values: [
            { id: 2427, label: 'Weicher Griff', value: 'weicher_griff' },
            { id: 2435, label: 'Ton-in-Ton-Nähte', value: 'tonintonnhte' },
            { id: 2438, label: 'Label-Stickerei', value: 'labelstickerei' },
          ],
        }),
      }
      const formattedAttributes = getFilteredAttributeGroups(
        attributes as Attributes,
        ['design', 'extras'],
      )

      expect(formattedAttributes).toHaveLength(2)
      expect(formattedAttributes.get('design')).toStrictEqual([
        'Jackenart: Bomberjacke',
      ])
      expect(formattedAttributes.get('extras')).toStrictEqual([
        'Weicher Griff',
        'Ton-in-Ton-Nähte',
        'Label-Stickerei',
      ])
    })
  })

  describe('getAdvancedAttributes', () => {
    const product = productFactory.build({
      advancedAttributes: {
        productName: advancedAttributeFactory.build({
          key: 'productName',
          values: [
            {
              fieldSet: [[{ value: "Jacke 'Premium Essentials'" }]],
              groupSet: [],
            },
          ],
        }),
      },
    })

    it('should return correct advanced attribute', () => {
      const advancedAttribute = getAdvancedAttributes({
        product,
        property: 'productName',
      })

      expect(advancedAttribute).toStrictEqual(["Jacke 'Premium Essentials'"])
    })
  })
})
