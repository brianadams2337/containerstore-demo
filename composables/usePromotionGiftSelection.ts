import {
  ExistingItemHandling,
  type Product,
  type Value,
  type Variant,
  type CentAmount,
  getFirstAttributeValue,
  getPrice,
  getVariantBySize,
  extendPromise,
} from '@scayle/storefront-nuxt'
import { computed } from 'vue'
import { useBasketActions } from '~/composables/useBasketActions'
import { useFlyouts } from '~/composables/useFlyouts'
import { useProductBaseInfo } from '~/composables/useProductBaseInfo'
import { useToast } from '~/composables/useToast'
import { useTrackingEvents } from '~/composables/useTrackingEvents'
import { useState } from '#app/composables/state'
import { useNuxtApp } from '#app'
import { useRoute } from '#app/composables/router'
import { useLocalePath } from '#i18n'
import { useBasket } from '#storefront/composables'
import {
  createCustomPrice,
  hasOneSizeProductVariantOnly,
  routeList,
} from '~/utils'

export function usePromotionGiftSelection(gift: Product) {
  const { $i18n } = useNuxtApp()
  const toast = useToast()

  const route = useRoute()

  const { trackAddToBasket } = useTrackingEvents()
  const localePath = useLocalePath()

  const { openBasketFlyout } = useFlyouts()

  const activeVariant = useState<Variant | undefined>(
    `active-gift-variant-${gift.id}`,
  )

  const isSelectionShown = useState(`gift-selection-${gift.id}`, () => false)

  const { brand, variantWithLowestPrice } = useProductBaseInfo(gift)

  const basket = useBasket()
  const basketActions = useBasketActions()

  const { fetching: basketIdle, addItem: addBasketItem } = basket
  const { showAddToBasketToast } = basketActions

  const toggleGiftSelection = () => {
    isSelectionShown.value = !isSelectionShown.value
  }

  const isGiftSelectionShown = computed(() => isSelectionShown.value)

  const lowestPriorPrice = computed(
    () =>
      activeVariant.value?.lowestPriorPrice ||
      variantWithLowestPrice.value?.lowestPriorPrice ||
      gift?.lowestPriorPrice,
  )

  const price = computed(() => {
    const nonGiftPrice = activeVariant.value
      ? getPrice(activeVariant.value)
      : variantWithLowestPrice.value?.price

    if (!nonGiftPrice) {
      return
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

  const handleSelectedSize = (value: Value) => {
    if (gift.variants) {
      activeVariant.value = getVariantBySize(gift.variants, value, 'size')
    }
  }

  const size = computed(() => {
    return getFirstAttributeValue(activeVariant.value?.attributes, 'size')
      ?.value
  })

  const hasOneSizeVariantOnly = computed(() => {
    return hasOneSizeProductVariantOnly(gift)
  })

  const hasSpecial = computed(() => {
    return Boolean(
      !activeVariant.value && price.value?.appliedReductions.length,
    )
  })

  const addItemToBasket = async (promotionId?: string) => {
    if (hasOneSizeVariantOnly.value && gift?.variants) {
      activeVariant.value = gift.variants[0]
    }

    if (!activeVariant.value) {
      toast.show($i18n.t('basket.notification.select_size'), {
        action: 'CONFIRM',
      })
      return
    }

    const brandName = brand.value || $i18n.t('wishlist.product')

    try {
      await addBasketItem({
        variantId: activeVariant.value.id,
        quantity: 1,
        existingItemHandling: ExistingItemHandling.ReplaceExisting,
        ...(promotionId && { promotionId }),
      })

      openBasketFlyout()

      if (route.path !== localePath(routeList.basket)) {
        showAddToBasketToast(true, gift)
      }

      if (gift) {
        trackAddToBasket({
          product: gift,
          variant: activeVariant.value,
          index: 1,
        })
      }
    } catch {
      toast.show(
        $i18n.t('basket.notification.add_to_basket_error', {
          brandName,
        }),
        {
          action: 'CONFIRM',
        },
      )
    } finally {
      activeVariant.value = undefined
      toggleGiftSelection()
    }
  }

  return extendPromise(
    Promise.all([basket, basketActions]).then(() => ({})),
    {
      basketIdle,
      hasSpecial,
      addItemToBasket,
      lowestPriorPrice,
      handleSelectedSize,
      size,
      price,
      hasOneSizeVariantOnly,
      activeVariant,
      isGiftSelectionShown,
      toggleGiftSelection,
    },
  )
}
