import { it, describe, expect } from 'vitest'
import type { Attributes } from '@scayle/storefront-nuxt'
import { getFilteredAttributeGroups } from '~/utils/attribute'
import { attributeGroupFactory } from '~/test/factories/attribute'

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
})
