import type { BasketItem, BasketTotalPrice } from '@scayle/storefront-nuxt'
import { toRef } from '@vueuse/core'
import { computed, type ComputedRef, type MaybeRefOrGetter } from 'vue'
import { getTotalReductionsByCategory } from '~/utils'

export type PromotionReductionItem = {
  promotion: BasketItem['promotion']
  total: number
}

export interface UseBasketPromotionReductionsReturn {
  /** Total amount of all promotion reductions  */
  totalPromotionReductions: ComputedRef<number>
  /** A list of all promotions together with the total reductions ot the promotion */
  basketPromotionSummaries: ComputedRef<Map<string, PromotionReductionItem>>
}

/**
 * A composable for manipulating and extracting basket promotion reductions data.
 *
 * @param cost - The total cost of the basket
 * @param items - The items in the basket
 * @returns An {@link UseBasketPromotionReductionsReturn} object containing reactive reduction data.
 */
export function useBasketPromotionReductions(
  cost: MaybeRefOrGetter<BasketTotalPrice | undefined>,
  items: MaybeRefOrGetter<BasketItem[] | undefined>,
): UseBasketPromotionReductionsReturn {
  const basketCost = toRef(cost)
  const basketItems = toRef(items)

  const hasPromotionReduction = (item?: BasketItem): boolean => {
    const appliedReductions = item?.price?.total?.appliedReductions ?? []
    return appliedReductions.some(({ category }) => category === 'promotion')
  }

  const getTotalReductionForPromotion = (item: BasketItem): number => {
    return item.price.total.appliedReductions.reduce<number>(
      (price, currentItem) => {
        return currentItem.category === 'promotion'
          ? price + currentItem.amount.absoluteWithTax
          : price
      },
      0,
    )
  }

  const totalPromotionReductions = computed<number>(() => {
    return basketCost.value
      ? getTotalReductionsByCategory(basketCost.value, 'promotion')
      : 0
  })

  const basketPromotionSummaries = computed(() => {
    return (basketItems.value ?? []).reduce((map, basketItem) => {
      if (!basketItem?.promotion?.id || !hasPromotionReduction(basketItem)) {
        return map
      }

      const existingPromotion = map.get(basketItem.promotion.id)

      const price = getTotalReductionForPromotion(basketItem)

      if (existingPromotion) {
        existingPromotion.total += price
        map.set(basketItem.promotion.id, existingPromotion)
      } else {
        map.set(basketItem.promotion.id, {
          promotion: basketItem.promotion,
          total: price,
        })
      }

      return map
    }, new Map<string, PromotionReductionItem>())
  })

  return {
    totalPromotionReductions,
    basketPromotionSummaries,
  }
}
