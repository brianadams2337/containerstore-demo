import { computed, onScopeDispose } from 'vue'
import {
  ExistingItemHandling,
  type Product,
  type Variant,
  type CentAmount,
  extendPromise,
} from '@scayle/storefront-nuxt'
import { whenever } from '@vueuse/core'
import { useBasketActions } from '~/composables/useBasketActions'
import { useProductBaseInfo } from '~/composables/useProductBaseInfo'
import { useToast } from '~/composables/useToast'
import { useTrackingEvents } from '~/composables/useTrackingEvents'
import { useState } from '#app/composables/state'
import { useNuxtApp } from '#app'
import { useBasket } from '#storefront/composables'
import { createCustomPrice } from '~/utils'

export function usePromotionGiftSelection(gift: Product) {
  const { $i18n } = useNuxtApp()
  const toast = useToast()

  const { trackAddToBasket } = useTrackingEvents()

  const {
    name,
    price: productPrice,
    lowestPriorPrice: productLowestPriorPrice,
    hasOneVariantOnly,
  } = useProductBaseInfo(gift)
  const activeVariant = useState<Variant | undefined>(
    `active-gift-variant-${gift.id}`,
  )

  const isSelectionShown = useState(`gift-selection-${gift.id}`, () => false)

  onScopeDispose(() => {
    isSelectionShown.value = false
  })

  const basket = useBasket()
  const basketActions = useBasketActions()

  const { status } = basket
  const { addItem } = basketActions

  const toggleGiftSelection = () => {
    isSelectionShown.value = !isSelectionShown.value
  }

  const isGiftSelectionShown = computed(() => isSelectionShown.value)

  const lowestPriorPrice = computed(() =>
    activeVariant.value ? activeVariant.value : productLowestPriorPrice.value,
  )

  const price = computed(() => {
    if (activeVariant.value) {
      return activeVariant.value.price
    }

    const nonGiftPrice = productPrice.value
    if (!nonGiftPrice) {
      return undefined
    }

    return createCustomPrice(nonGiftPrice, {
      withTax: 0 as CentAmount,
      appliedReductions: [
        {
          amount: {
            absoluteWithTax: nonGiftPrice.withTax as CentAmount,
            relative: 1,
          },
          type: 'relative',
          category: 'promotion',
        },
      ],
    })
  })

  const giftVariants = computed<Variant[]>(() => {
    return (
      gift.variants?.map((variant) => {
        const price = createCustomPrice(variant.price, {
          withTax: 0 as CentAmount,
          appliedReductions: [
            {
              amount: {
                absoluteWithTax: variant.price.withTax as CentAmount,
                relative: 1,
              },
              type: 'relative',
              category: 'promotion',
            },
          ],
        })
        return {
          ...variant,
          price,
        }
      }) ?? []
    )
  })

  // Weh only want preselect the active variant when `hasOneVariantOnly.value` is truthy.
  // `whenever()` is a shorthand for watching the value to be truthy.
  whenever(
    hasOneVariantOnly,
    () => {
      activeVariant.value = giftVariants.value?.[0]
    },
    { immediate: true, once: true },
  )

  const addItemToBasket = async (promotionId: string) => {
    if (!activeVariant.value) {
      toast.show($i18n.t('basket.notification.select_size'), {
        action: 'CONFIRM',
      })
      return
    }

    const productName = name.value || $i18n.t('wishlist.product')

    await addItem({
      variantId: activeVariant.value.id,
      productName,
      quantity: 1,
      existingItemHandling: ExistingItemHandling.REPLACE_EXISTING,
      promotionId,
    })

    if (gift) {
      trackAddToBasket({
        product: gift,
        variant: activeVariant.value,
        index: 1,
      })
    }
    if (!hasOneVariantOnly.value) {
      activeVariant.value = undefined
    }
    toggleGiftSelection()
  }

  return extendPromise(
    Promise.all([basket, basketActions]).then(() => ({})),
    {
      status,
      addItemToBasket,
      lowestPriorPrice,
      price,
      activeVariant,
      giftVariants,
      isGiftSelectionShown,
      toggleGiftSelection,
    },
  )
}
