import { getFirstAttributeValue } from '@scayle/storefront-nuxt'
import { navigateTo, defineNuxtRouteMiddleware } from '#app/composables/router'
import { useRouteHelpers } from '~/composables'
import { useProduct } from '#storefront/composables'
import { getProductId } from '~/utils/route'
import { PRODUCT_DETAIL_WITH_PARAMS } from '~/constants'
import { globalGetCachedData } from '~/utils/useRpc'

export default defineNuxtRouteMiddleware(
  async ({ params, query, path, hash }) => {
    const { getProductDetailRoute } = useRouteHelpers()
    const productId = getProductId(params)

    // We use the same option as on the PDP together with `globalGetCachedData` in order to share data between this middleware and the PDP.
    // This helps reducing network requests on client navigation.
    const { data: product } = await useProduct(
      {
        params: {
          id: productId,
          with: PRODUCT_DETAIL_WITH_PARAMS,
        },
        options: {
          dedupe: 'defer',
          getCachedData: globalGetCachedData,
        },
      },
      `PDP-${productId}`,
    )

    if (!product.value) {
      return
    }

    const expectedPath = getProductDetailRoute(
      product.value.id,
      getFirstAttributeValue(product.value?.attributes, 'name')?.label,
    )

    if (expectedPath === path) {
      return
    }

    return navigateTo(
      { path: expectedPath, query, hash },
      { redirectCode: 301 },
    )
  },
)
