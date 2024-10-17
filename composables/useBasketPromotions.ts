import { extendPromise } from '@scayle/storefront-nuxt'
import { computed, type ComputedRef } from 'vue'
import { useBasket, useCurrentPromotions } from '#storefront/composables'
import { isAutomaticDiscountType, isBuyXGetYType } from '~/utils'
import type { Promotion, BasketPromotion } from '~/types/promotion'

type UseBasketPromotionsReturn = {
  appliedPromotions: ComputedRef<(BasketPromotion & { productId: number })[]>
  buyXGetYPromotions: ComputedRef<(BasketPromotion & { productId: number })[]>
  automaticDiscountPromotions: ComputedRef<
    (BasketPromotion & { productId: number })[]
  >
  hasAppliedPromotions: ComputedRef<boolean>
  allCurrentPromotions: ComputedRef<Promotion[]>
}

export function useBasketPromotions(): UseBasketPromotionsReturn &
  Promise<UseBasketPromotionsReturn> {
  const basket = useBasket()
  const promotionData = useCurrentPromotions()

  const { items: basketItems } = basket

  const allCurrentPromotions = computed<Promotion[]>(() => {
    return promotionData.data?.value?.entities ?? []
  })

  const appliedPromotions = computed(() => {
    if (!basketItems.value) {
      return []
    }
    return basketItems.value
      .filter(({ promotion }) => promotion?.isValid)
      .map(({ promotion, product }) => ({
        ...promotion,
        productId: product.id,
      })) as (BasketPromotion & { productId: number })[]
  })

  const buyXGetYPromotions = computed(() => {
    const appliedPromotionsBuyXGetX =
      appliedPromotions.value.filter(isBuyXGetYType)

    return appliedPromotionsBuyXGetX.filter(
      (item, index, self) =>
        index === self.findIndex((arrayItem) => arrayItem.id === item.id),
    )
  })

  const automaticDiscountPromotions = computed(() => {
    const appliedPromotionsAutomaticDiscount = appliedPromotions.value.filter(
      isAutomaticDiscountType,
    )

    return appliedPromotionsAutomaticDiscount.filter(
      (item, index, self) =>
        index === self.findIndex((arrayItem) => arrayItem.id === item.id),
    )
  })

  const hasAppliedPromotions = computed(() => !!appliedPromotions.value.length)

  return extendPromise(
    Promise.all([basket, promotionData]).then(() => ({})),
    {
      appliedPromotions,
      buyXGetYPromotions,
      automaticDiscountPromotions,
      hasAppliedPromotions,
      allCurrentPromotions,
    },
  )
}
