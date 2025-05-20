import {
  type Promotion,
  type Product,
  extendPromise,
} from '@scayle/storefront-nuxt'
import { type MaybeRefOrGetter, computed, type ComputedRef } from 'vue'
import { toRef } from '@vueuse/core'
import { useCurrentPromotions } from '#storefront/composables'
import { getPromotionForProduct } from '~/utils'

type UseProductPromotionsReturn = {
  /** A computed ref holding the promotion which is connected to the passed product. `undefined` when no Promotion is connected to the passed product. */
  promotion: ComputedRef<Promotion | undefined>
}

/**
 * Composable for extracted product promotions data.
 *
 * @param productItem - Product on which promotions will be extracted
 * @returns An {@link UseProductPromotionsReturn} object containing reactive product promotion data.
 */
export function useProductPromotions(
  productItem?: MaybeRefOrGetter<Product | undefined | null>,
): UseProductPromotionsReturn & Promise<UseProductPromotionsReturn> {
  const promotionData = useCurrentPromotions()

  const product = toRef(productItem)

  const promotions = computed<Promotion[]>(() => {
    return promotionData.data?.value?.entities ?? []
  })

  const promotion = computed(() => {
    if (!product.value || !promotions.value.length) {
      return
    }

    return getPromotionForProduct(product.value, promotions.value)
  })

  return extendPromise(
    promotionData.then(() => ({})),
    { promotion },
  )
}
