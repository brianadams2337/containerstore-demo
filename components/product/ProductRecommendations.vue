<template>
  <SFHorizontalItemsSlider
    class="space-x-2"
    spaced-items
    spaced-width="sm"
    hide-disabled-arrows
    with-arrows
  >
    <ProductCard
      v-for="(recommendation, idx) in sliderProducts"
      :id="recommendation.id"
      :key="`product-recommendation-${recommendation.id}`"
      :product="recommendation"
      :listing-meta-data="{
        name: 'Product Recommendation List',
        id: 'ProductRecommendationList',
      }"
      :name="getName(recommendation.attributes)"
      :class="sizeClasses"
      :link="
        getProductDetailRoute(
          recommendation.id,
          getName(recommendation.attributes),
        )
      "
      :image="getPrimaryImage(recommendation.images)"
      :price="getLowestPrice(recommendation.variants ?? [])"
      :show-add-to-cart="false"
      :show-add-to-wishlist="false"
      :show-available-colors="false"
      @intersect:product="collectColumnIntersection($event, idx)"
      @click.capture="trackRecommendationClick(recommendation, idx)"
    />
  </SFHorizontalItemsSlider>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import {
  type Product,
  type Attributes,
  getFirstAttributeValue,
  getLowestPrice,
  isFirstIndexOfRow,
} from '@scayle/storefront-nuxt'
import {
  useDefaultBreakpoints,
  useProductRecommendations,
  useRouteHelpers,
  useTrackingEvents,
} from '~/composables'
import { productListingMetaData } from '~/constants'
import { Size } from '#storefront-ui'
import { getPrimaryImage } from '~/utils'

type Props = {
  combineWithProductIds: number[]
  size?: Size
}

const props = withDefaults(defineProps<Props>(), { size: Size.MD })

const getName = (attributes?: Attributes) =>
  getFirstAttributeValue(attributes, 'name')?.label

const { sliderProducts, trackRecommendationClick } = useProductRecommendations(
  props.combineWithProductIds,
  `product-recommendations-[${props.combineWithProductIds.join(',')}]`,
)

const { isGreaterOrEqual } = useDefaultBreakpoints()
const { getProductDetailRoute } = useRouteHelpers()

// TODO: Extract logic to a composable
const trackingCollector = ref<(Product & { index: number })[]>([])
const { trackViewItemList } = useTrackingEvents()

const trackViewListing = ({
  items,
}: {
  row: number
  items: (Product & { index: number })[]
}) => {
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
