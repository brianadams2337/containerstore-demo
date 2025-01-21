import type {
  AppliedReduction,
  BasketItem,
  BasketTotalPrice,
} from '@scayle/storefront-nuxt'
import { toRef } from '@vueuse/core'
import { computed, type ComputedRef, type MaybeRefOrGetter } from 'vue'
import { getTotalReductionsByCategory } from '~/utils'

type PromotionReductionItem = {
  promotion: BasketItem['promotion']
  total: number
}

export interface UseBasketReductionsReturn {
  /** Total amount of all sales reductions */
  totalSaleReductions: ComputedRef<number>
  /** Total amount of all campaign reductions  */
  totalCampaignReductions: ComputedRef<number>
  /** Total amount of all promotion reductions  */
  totalPromotionReductions: ComputedRef<number>
  /** A list of all promotions together with the total reductions ot the promotion */
  itemsWithPromotionReductions: ComputedRef<PromotionReductionItem[]>
  /** Boolean indicating whether there are any reductions in the basket */
  hasReductions: ComputedRef<boolean>
}

/**
 *
 * @param cost - The total cost of the basket
 * @param items - The items in the basket
 * @returns An {@link UseBasketReductionsReturn} object containing reactive reduction data.
 */
export function useBasketReductions(
  cost: MaybeRefOrGetter<BasketTotalPrice | undefined>,
  items: MaybeRefOrGetter<BasketItem[] | undefined>,
): UseBasketReductionsReturn {
  const basketCost = toRef(cost)
  const basketItems = toRef(items)

  const getReductions = (category: AppliedReduction['category']) =>
    computed<number>(() => {
      return basketCost.value
        ? getTotalReductionsByCategory(basketCost.value, category)
        : 0
    })

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

  const totalSaleReductions = getReductions('sale')
  const totalCampaignReductions = getReductions('campaign')
  const totalPromotionReductions = getReductions('promotion')

  const hasReductions = computed<boolean>(() => {
    return !!(
      totalPromotionReductions.value ||
      totalCampaignReductions.value ||
      totalSaleReductions.value
    )
  })

  const itemsWithPromotionReductions = computed<PromotionReductionItem[]>(
    () => {
      return (basketItems.value ?? []).reduce<PromotionReductionItem[]>(
        (items, basketItem) => {
          if (!hasPromotionReduction(basketItem)) {
            return items
          }

          const existingPromotion = items.find(
            ({ promotion }) => promotion?.id === basketItem.promotion?.id,
          )

          const price = getTotalReductionForPromotion(basketItem)

          if (existingPromotion) {
            existingPromotion.total += price
          } else {
            items.push({ promotion: basketItem.promotion, total: price })
          }

          return items
        },
        [],
      )
    },
  )

  return {
    totalSaleReductions,
    totalCampaignReductions,
    totalPromotionReductions,
    itemsWithPromotionReductions,
    hasReductions,
  }
}
