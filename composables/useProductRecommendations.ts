import type { Product, FetchProductsParams } from '@scayle/storefront-nuxt'

export async function useProductRecommendations() {
  const { product, productId, listingMetaData } = await useProductDetails()

  const { trackSelectItem } = useTrackingEvents()

  const route = useRoute()
  const { pageState } = usePageState()

  const combineWithProductValues = getAdvancedAttributes({
    product: product.value,
    property: 'combineWith',
  })

  const combineWithProductIds = computed(() =>
    combineWithProductValues
      ? combineWithProductValues
          .split(',')
          .map((productId: string) => parseInt(productId, 10))
      : [],
  )
  const recommendationsFetchParams = ref<FetchProductsParams>({ ids: [] })

  const { data: combineWithProducts, fetching: fetchingCombineWithProducts } =
    await useProductsByIds({
      params: recommendationsFetchParams,
      key: `products-pdpSlider-combineWith-${productId.value}`,
    })

  const combineWith = computed(() => combineWithProducts.value || [])

  const sliderProducts = computed(() =>
    combineWith.value.length
      ? combineWith.value.filter(
          (product) => product.isActive && !product.isSoldOut,
        )
      : [],
  )

  const trackRecommendationClick = (product: Product, index: number) => {
    trackSelectItem({
      product,
      category: {
        ...getDeepestCategoryForTracking(product.categories),
      },
      listingMetaData,
      index,
      ...(route.name && {
        source: `${String(route.name)}|RecommendationSlider`,
      }),
      soldOut: product.isSoldOut,
      pagePayload: {
        content_name: route.fullPath,
        page_type: pageState.value.type,
        page_type_id: productId.value.toString() || '',
      },
    })
  }

  watch(
    combineWithProductIds,
    (ids) => Object.assign(recommendationsFetchParams.value, { ids }),
    { immediate: true },
  )

  return {
    sliderProducts,
    fetchingCombineWithProducts,
    trackRecommendationClick,
  }
}
