<template>
  <SFHorizontalItemsSlider
    class="space-x-2"
    spaced-items
    spaced-width="sm"
    with-arrows
  >
    <ProductCard
      v-for="(recommendation, idx) in sliderProducts"
      :id="recommendation.id"
      :key="`product-recommendation-${recommendation.id}`"
      :loading="fetchingCombineWithProducts"
      :product="recommendation"
      :listing-meta-data="{
        name: 'Product Recommendation List',
        id: 'ProductRecommendationList',
      }"
      :name="getFirstAttributeValue(recommendation.attributes, 'name')?.label"
      :class="sizeClasses"
      :link="getProductDetailRoute(recommendation)"
      :image="getImageFromList(recommendation.images, 'model', 'front')"
      :price="getLowestPrice(recommendation.variants ?? [])"
      :lowest-prior-price="
        getVariantWithLowestPrice(recommendation.variants)?.lowestPriorPrice
      "
      :show-add-to-cart="false"
      :show-add-to-wishlist="false"
      :show-available-colors="false"
      @intersect:product="collectColumnIntersection($event, idx)"
      @click.capture="trackRecommendationClick(recommendation, idx)"
    />
  </SFHorizontalItemsSlider>
</template>

<script setup lang="ts">
import {
  getLowestPrice,
  getFirstAttributeValue,
  isFirstIndexOfRow,
  type Product,
} from '@scayle/storefront-nuxt'
import { productListingMetaData, Size } from '#imports'
import { computed } from 'vue'

type Props = {
  combineWithProductIds: number[]
  size?: Size
}

// TODO use computed property for dynamic class bindings on line 24
const props = withDefaults(defineProps<Props>(), { size: Size.MD })

const {
  sliderProducts,
  fetchingCombineWithProducts,
  trackRecommendationClick,
} = await useProductRecommendations(props.combineWithProductIds)

const { isGreaterOrEqual } = useDefaultBreakpoints()
const { getProductDetailRoute } = useRouteHelpers()

// TODO: Extract logic to a composable
const trackingCollector = ref<Product[]>([])
const { trackViewItemList } = useTrackingEvents()

const trackViewListing = ({ items }: { row: number; items: Product[] }) => {
  trackViewItemList({ items, listingMetaData: productListingMetaData })
}

const collectColumnIntersection = (productId: number, index: number) => {
  const isTracked =
    trackingCollector.value.findIndex((p) => p.id === productId) !== -1

  const columns = isGreaterOrEqual('md') ? 2 : 4

  const isFirstItemInRow = isFirstIndexOfRow(index, columns)

  if (isFirstItemInRow && !isTracked) {
    const itemsInSliderRow = [...sliderProducts.value]
      .slice(index, index + columns)
      .map((item, idx) => ({ ...item, index: index + idx }))

    trackViewListing({
      row: index,
      items: itemsInSliderRow,
    })

    trackingCollector.value.push(...itemsInSliderRow)
  }
}

const sizeClasses = computed(() => ({
  'min-w-4xs max-w-4xs': props.size === Size['4XS'],
  'min-w-xs max-w-xs': props.size === Size.XS,
  'min-w-md max-w-md': props.size === Size.MD,
  'min-w-lg max-w-lg': props.size === Size.LG,
  'min-w-xl max-w-xl': props.size === Size.XL,
}))
</script>
