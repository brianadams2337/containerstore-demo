import { type FetchProductsParams, type Product } from '@scayle/storefront-nuxt'
import { productListingMetaData } from '~/constants/product'

export async function useProductRecommendations(
  combineWithProductIds: Array<number>,
  key?: string,
) {
  const { trackSelectItem } = useTrackingEvents()
  const route = useRoute()
  const { pageState } = usePageState()

  const recommendationsFetchParams = computed<FetchProductsParams>(() => {
    return { ids: combineWithProductIds }
  })

  const { data: combineWithProducts, fetching: fetchingCombineWithProducts } =
    await useProductsByIds({
      params: recommendationsFetchParams,
      key: `pdp-recommendations-${key}`,
    })

  const sliderProducts = computed(() =>
    (combineWithProducts.value ?? []).filter(
      (product) => product.isActive && !product.isSoldOut,
    ),
  )

  const trackRecommendationClick = (product: Product, index: number) => {
    trackSelectItem({
      product,
      category: {
        ...getDeepestCategoryForTracking(product.categories),
      },
      listingMetaData: productListingMetaData,
      index,
      ...(route.name && {
        source: `${String(route.name)}|RecommendationSlider`,
      }),
      soldOut: product.isSoldOut,
      pagePayload: {
        content_name: route.fullPath,
        page_type: pageState.value.type,
        page_type_id: pageState.value.typeId,
      },
    })
  }

  return {
    sliderProducts,
    fetchingCombineWithProducts,
    trackRecommendationClick,
  }
}
