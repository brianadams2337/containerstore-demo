import { toRef, defineComponent } from 'vue'
import { describe, expect, it, vi } from 'vitest'
import { ExistingItemHandling } from '@scayle/storefront-api'
import { flushPromises, mount } from '@vue/test-utils'
import { useBasketActions } from './useBasketActions'
import { basketItemFactory } from '~/test/factories/basket'

const { useBasket, useTrackingEvents } = vi.hoisted(() => {
  return {
    useBasket: vi.fn(),
    useUser: vi.fn(),
    useTrackingEvents: vi.fn().mockReturnValue({
      trackRemoveFromBasket: vi.fn(),
      trackBasket: vi.fn(),
      collectBasketItems: vi.fn(),
      trackAddToBasket: vi.fn(),
    }),
  }
})

vi.mock('#storefront/composables', async () => {
  const actual = await vi.importActual('#storefront/composables')
  return {
    ...actual,
    useBasket,
  }
})

vi.mock('~/composables/useTrackingEvents', () => {
  return { useTrackingEvents }
})

vi.mock('nanoid', () => {
  return {
    nanoid: () => 'nanoid',
  }
})

// `useBasketActions` needs to be wrapped in a vue component because it uses `useI18n`.
// `useI18n` needs to run in the an setup function.
const getTestComponentWrapper = async () => {
  const wrapper = mount(
    defineComponent({
      template: '<div />',
      setup() {
        return {
          ...useBasketActions(),
        }
      },
    }),
  )
  await flushPromises()
  return wrapper.vm
}

describe('useBasketActions', () => {
  const addItemMock = vi.fn()
  const removeItemMock = vi.fn()
  useBasket.mockReturnValue({
    then: vi.fn(),
    addItem: addItemMock,
    removeItem: removeItemMock,
  })

  describe('addItem', () => {
    it('should keep existingItemHandling of passed item', async () => {
      const { addItem } = await getTestComponentWrapper()
      await addItem({
        productName: 'Test',
        quantity: 1,
        variantId: 1,
        existingItemHandling:
          ExistingItemHandling.ReplaceExistingWithCombinedQuantity,
      })

      expect(addItemMock).toBeCalledWith({
        productName: 'Test',
        quantity: 1,
        variantId: 1,
        existingItemHandling:
          ExistingItemHandling.ReplaceExistingWithCombinedQuantity,
      })
    })
    it('should use "ExistingItemHandling.AddQuantityToExisting" when existingItemHandling was not specified', async () => {
      const { addItem } = await getTestComponentWrapper()
      await addItem({
        productName: 'Test',
        quantity: 1,
        variantId: 1,
      })

      expect(addItemMock).toBeCalledWith({
        productName: 'Test',
        quantity: 1,
        variantId: 1,
        existingItemHandling: ExistingItemHandling.AddQuantityToExisting,
      })
    })
    it('should keep the passed item group', async () => {
      const { addItem } = await getTestComponentWrapper()
      await addItem({
        productName: 'Test',
        quantity: 1,
        variantId: 1,
        itemGroup: { id: 'id', isMainItem: true, isRequired: true },
      })

      expect(addItemMock).toBeCalledWith({
        productName: 'Test',
        quantity: 1,
        variantId: 1,
        existingItemHandling: ExistingItemHandling.AddQuantityToExisting,
        itemGroup: { id: 'id', isMainItem: true, isRequired: true },
      })
    })
    it('should not create an group for normal products', async () => {
      const { addItem } = await getTestComponentWrapper()
      await addItem({
        productName: 'Test',
        quantity: 1,
        variantId: 1,
      })

      expect(addItemMock).toBeCalledWith({
        productName: 'Test',
        quantity: 1,
        variantId: 1,
        existingItemHandling: ExistingItemHandling.AddQuantityToExisting,
      })
    })
    it('should reuse the item group of the same subscription product in basket', async () => {
      useBasket.mockReturnValue({
        then: vi.fn(),
        addItem: addItemMock,
        items: toRef([
          basketItemFactory.build({
            variant: { id: 1 },
            customData: {
              subscriptionDefinition: {},
            },
            itemGroup: {
              id: 'reuse',
              isMainItem: true,
              isRequired: true,
            },
          }),
        ]),
      })

      const { addItem } = await getTestComponentWrapper()

      await addItem({
        productName: 'Test',
        quantity: 1,
        variantId: 1,
        customData: {
          subscriptionDefinition: {},
        },
      })

      expect(addItemMock).toBeCalledWith({
        productName: 'Test',
        quantity: 1,
        variantId: 1,
        existingItemHandling: ExistingItemHandling.AddQuantityToExisting,
        customData: {
          subscriptionDefinition: {},
        },
        itemGroup: {
          id: 'reuse',
          isMainItem: true,
          isRequired: true,
        },
      })
    })
    it('should create a new item group for a new subscription product', async () => {
      useBasket.mockReturnValue({
        then: vi.fn(),
        addItem: addItemMock,
        items: toRef([]),
      })

      const { addItem } = await getTestComponentWrapper()

      await addItem({
        productName: 'Test',
        quantity: 1,
        variantId: 1,
        customData: {
          subscriptionDefinition: {},
        },
      })

      expect(addItemMock).toBeCalledWith({
        productName: 'Test',
        quantity: 1,
        variantId: 1,
        existingItemHandling: ExistingItemHandling.AddQuantityToExisting,
        customData: {
          subscriptionDefinition: {},
        },
        itemGroup: { id: 'nanoid', isMainItem: true, isRequired: true },
      })
    })
  })
  describe('updateItemQuantity', () => {
    it('should use "ExistingItemHandling.ReplaceExisting" when updating the quantity', async () => {
      useBasket.mockReturnValue({
        then: vi.fn(),
        addItem: addItemMock,
        items: toRef([]),
      })
      const basketItem = basketItemFactory.build({
        variant: { id: 1 },
        quantity: 1,
        customData: {
          subscriptionDefinition: {},
        },
        displayData: {},
        itemGroup: {
          id: 'id',
          isMainItem: true,
          isRequired: true,
        },
      })
      const { updateItemQuantity } = await getTestComponentWrapper()
      await updateItemQuantity(basketItem, 2)

      expect(addItemMock).toBeCalledWith({
        productName: 'Test Product',
        quantity: 2,
        variantId: 1,
        existingItemHandling: ExistingItemHandling.ReplaceExisting,
        displayData: {},
        itemGroup: {
          id: 'id',
          isMainItem: true,
          isRequired: true,
        },
        customData: {
          subscriptionDefinition: {},
        },
      })
      expect(useTrackingEvents().trackAddToBasket).toBeCalledWith({
        product: basketItem.product,
        variant: basketItem.variant,
        quantity: 2,
      })
    })
  })
  describe('removeItem', () => {
    it('should remove the item from basket and track everything', async () => {
      const basketItem = basketItemFactory.build({
        variant: { id: 1 },
        quantity: 1,
      })
      useBasket.mockReturnValue({
        then: vi.fn(),
        addItem: addItemMock,
        removeItem: removeItemMock,
        items: toRef([basketItem]),
      })
      const { removeItem } = await getTestComponentWrapper()
      await removeItem(basketItem)

      expect(removeItemMock).toBeCalledWith({
        variantId: basketItem.variant.id,
      })
      const { trackRemoveFromBasket } = useTrackingEvents()
      expect(trackRemoveFromBasket).toBeCalledWith({
        product: basketItem.product,
        variant: basketItem.variant,
        quantity: basketItem.quantity,
      })
    })
  })
})
