import { extendPromise, type Promotion } from '@scayle/storefront-nuxt'
import { computed, type ComputedRef } from 'vue'
import { useBasket, useCurrentPromotions } from '#storefront/composables'
import { getPromotionIdFromProductAttributes } from '~/utils'

type UseMovPromotionsReturn = {
  /** A list of MOV promotions which have at least one promoted product in the basket. */
  movPromotions: ComputedRef<Promotion[]>
}
/**
 * A composable that retrieve a list of active MOV promotions.
 *
 * @returns A promise resolving to an object containing the mov promotions list.
 */
export function useMovPromotions(): UseMovPromotionsReturn &
  Promise<UseMovPromotionsReturn> {
  const basket = useBasket()
  const promotionData = useCurrentPromotions()

  const { items: basketItems } = basket

  const allCurrentPromotions = computed<Promotion[]>(() => {
    return promotionData.data?.value?.entities ?? []
  })

  const movPromotions = computed(() => {
    if (!allCurrentPromotions.value.length) {
      return []
    }

    return allCurrentPromotions.value.filter((promotion) => {
      const isPromotedBasketItem = (basketItems.value ?? []).some(
        ({ product, status }) => {
          if (status !== 'available') {
            return false
          }
          const productPromotionId =
            getPromotionIdFromProductAttributes(product)

          if (
            !productPromotionId ||
            !promotion.customData.product?.attributeId
          ) {
            return false
          }

          return productPromotionId === promotion.customData.product.attributeId
        },
      )

      return !!promotion?.customData?.minimumOrderValue && isPromotedBasketItem
    })
  })

  return extendPromise(
    Promise.all([basket, promotionData]).then(() => ({})),
    {
      movPromotions,
    },
  )
}
