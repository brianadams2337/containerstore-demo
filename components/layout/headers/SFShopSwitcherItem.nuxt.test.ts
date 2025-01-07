import { describe, it, expect } from 'vitest'
import { renderSuspended } from '@nuxt/test-utils/runtime'
import SFShopSwitcherItem from './SFShopSwitcherItem.vue'

describe('SFShopSwitcherItem.vue', () => {
  describe('shop name', () => {
    it('should print the shop name without the language', async () => {
      const { baseElement } = await renderSuspended(SFShopSwitcherItem, {
        props: { locale: 'en-US', isCurrent: false },
      })
      expect(baseElement).toHaveTextContent('United States')
    })

    it('should print the shop name with the language', async () => {
      const { baseElement } = await renderSuspended(SFShopSwitcherItem, {
        props: { locale: 'de-DE', isCurrent: false, includeLanguage: true },
      })
      expect(baseElement).toHaveTextContent('Deutschland | Deutsch')
    })

    it('should include the flag when includeFlag is tru', async () => {
      const { baseElement } = await renderSuspended(SFShopSwitcherItem, {
        props: {
          locale: 'es-US',
          isCurrent: false,
          includeLanguage: true,
          includeFlag: true,
        },
      })
      expect(baseElement).toHaveTextContent('🇺🇸 Estados Unidos | español')
    })
  })
})
