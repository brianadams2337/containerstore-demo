import {
  getFirstAttributeValue,
  getAttributeValueTuples,
} from '@scayle/storefront-nuxt'
import { type ComputedRef, type MaybeRefOrGetter, computed } from 'vue'
import { toRef } from '@vueuse/core'
import { useI18n } from '#i18n'
import type { OrderProduct, OrderVariant } from '~/types/order'
import { formatColors, mapAttributes } from '~/utils'
import { useRouteHelpers } from '~/composables'

/**
 * Interface representing the return type of useOrderProductDetails composable.
 */
export interface UseOrderProductDetailsReturn {
  /** The name of the product */
  name: ComputedRef<string>
  /** The brand of the product, if available */
  brand: ComputedRef<string | undefined>
  /** The first image of the product */
  image: ComputedRef<OrderProduct['images'][number]>
  /** The alt text for the product image */
  alt: ComputedRef<string>
  /** The size of the product */
  size: ComputedRef<string>
  /** The color of the product, if available */
  color: ComputedRef<string | undefined>
  /** The link to the product detail page */
  link: ComputedRef<string>
  /** The lowest prior price of the product variant */
  lowestPriorPrice: ComputedRef<OrderVariant['lowestPriorPrice']>
}

/**
 * Composable to get detailed information about an order product.
 *
 * @param orderProduct - The order product object or a ref to it
 * @param orderVariant - The order variant object or a ref to it
 * @returns An object containing computed properties for various product details such as name, image, color, brand size, link, alt and lowest prior price.
 */
export function useOrderProductDetails(
  orderProduct: MaybeRefOrGetter<OrderProduct>,
  orderVariant: MaybeRefOrGetter<OrderVariant>,
): UseOrderProductDetailsReturn {
  const product = toRef(orderProduct)
  const variant = toRef(orderVariant)

  const { t } = useI18n()

  const { getProductDetailRoute } = useRouteHelpers()

  const name = computed(() => product.value.name)

  const image = computed(() => product.value.images[0])

  const color = computed(() => {
    const attrs = mapAttributes(product.value.attributes)
    return getFirstAttributeValue(attrs, 'color')?.label
  })

  const brand = computed(() => {
    const attrs = mapAttributes(product.value.attributes)
    return getFirstAttributeValue(attrs, 'brand')?.label
  })

  const size = computed(() => variant.value.attributes?.size?.values.label)

  const link = computed(() => {
    return getProductDetailRoute(product.value.id, name.value)
  })

  const alt = computed(() => {
    return t('product_image.alt', {
      productName: name.value,
      colors: formatColors(
        getAttributeValueTuples(product.value.attributes, 'color'),
      ),
      brand: brand.value,
    })
  })

  const lowestPriorPrice = computed(() => variant.value.lowestPriorPrice)

  return {
    name,
    image,
    color,
    brand,
    size,
    link,
    alt,
    lowestPriorPrice,
  }
}
