import type { BasketItem, CentAmount } from '@scayle/storefront-nuxt'
import { type MaybeRefOrGetter, computed } from 'vue'
import { toRef } from '@vueuse/core'
import { isFreeGiftBasketItem, createCustomPrice } from '~/utils'

/**
 * Composable for extracting relevant data from a basket item.
 *
 * @param item The basket item to extract data from
 * @returns An object containing the extracted data: isFreeGift, price, and isSoldOut
 */
export function useBasketItem(item: MaybeRefOrGetter<BasketItem>) {
  const basketItem = toRef(item)

  const isSoldOut = computed(() => basketItem.value.status !== 'available')

  const isFreeGift = computed(() => !!isFreeGiftBasketItem(basketItem.value))

  const price = computed(() => {
    if (!isFreeGift.value) {
      return basketItem.value.price.total
    }
    const originalPrice = basketItem.value.price.total.appliedReductions.reduce(
      (acc, { amount }) => acc + amount.absoluteWithTax,
      0,
    )

    return createCustomPrice(basketItem.value.price.total, {
      withTax: 0 as CentAmount,
      appliedReductions: [
        {
          amount: {
            absoluteWithTax: originalPrice as CentAmount,
            relative: 1,
          },
          type: 'relative',
          category: 'promotion',
        },
      ],
    })
  })

  return { isFreeGift, price, isSoldOut }
}
