<template>
  <HorizontalItemsSlider
    :hide-overflow="isLookbookProducts"
    spaced-items
    spaced-width="sm">
    <button
      v-if="isLookbookProducts && activeIndex !== 0"
      class="absolute left-0 top-60 z-10 hidden text-gray-700 focus:outline-none sm:inline-block"
      @click="prev">
      <IconArrowLeft class="h-5 w-5" />
    </button>
    <div ref="carousel" class="flex space-x-2" :style="carouselStyles">
      <ProductCard
        v-for="(recommendation, idx) in products"
        :id="recommendation.id"
        :key="`product-recommendation-${recommendation.id}`"
        :loading="loading"
        :product="recommendation"
        :listing-meta-data="{
          name: 'Product Recommendation List',
          id: 'ProductRecommendationList',
        }"
        :name="getFirstAttributeValue(recommendation.attributes, 'name')?.label"
        :class="{
          'min-w-4xs': size === Size['4XS'],
          'min-w-xs': size === Size.XS,
          'min-w-md': size === Size.MD,
          'min-w-lg': size === Size.LG,
          'min-w-xl': size === Size.XL,
        }"
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
        @click.capture="emit('click:recommendation', recommendation, idx)" />
    </div>
    <button
      v-if="isLookbookProducts"
      class="absolute right-0 top-60 hidden text-gray-700 focus:outline-none sm:inline-block"
      @click="next">
      <IconArrowRight class="h-5 w-5" />
    </button>
  </HorizontalItemsSlider>
</template>

<script setup lang="ts">
import {
  getFirstAttributeValue,
  getLowestPrice,
  isFirstIndexOfRow,
  Product as BapiProduct,
} from '@scayle/storefront-nuxt'
import { Size } from '~/constants'

const props = defineProps({
  loading: {
    type: Boolean as PropType<boolean>,
    default: false,
  },
  products: {
    type: Array as PropType<BapiProduct[]>,
    default: () => [],
  },
  size: {
    type: String as PropType<Size>,
    default: Size.MD,
  },
  isLookbookProducts: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits<{
  (e: 'intersect:column', value: { row: number; items: BapiProduct[] }): void
  (e: 'click:recommendation', value: BapiProduct, i: number): void
}>()

const { md } = useViewportBreakpoints()

const trackingCollector = ref<BapiProduct[]>([])
const carousel = ref<HTMLDivElement>()
const carouselStyles = ref({
  transition: '1s ease',
  transform: 'translateX(0)',
})
const activeIndex = ref(0) // This keeps track of how many times the user has scrolled

const next = () => {
  const carouselWidth = carousel?.value?.scrollWidth
  // The check is because typescript complains that carouselWidth is possibly null
  const productCardWidth = carouselWidth
    ? carouselWidth / props.products.length
    : 0
  const numberOfCardsShown = Math.floor(window.innerWidth / productCardWidth)

  const targetScrollPosition =
    productCardWidth * numberOfCardsShown * (activeIndex.value + 1)
  if (carouselWidth && targetScrollPosition < carouselWidth) {
    carouselStyles.value.transform = `translateX(-${targetScrollPosition}px)`
    activeIndex.value++
  }
}

const prev = () => {
  const carouselWidth = carousel?.value?.scrollWidth
  // The check is because typescript complains that carouselWidth is possibly null
  const productCardWidth = carouselWidth
    ? carouselWidth / props.products.length
    : 0
  const numberOfCardsShown = Math.floor(window.innerWidth / productCardWidth)

  const targetScrollPosition =
    productCardWidth * numberOfCardsShown * (activeIndex.value - 1)
  if (targetScrollPosition >= 0) {
    carouselStyles.value.transform = `translateX(-${targetScrollPosition}px)`
    activeIndex.value--
  }
}

const columns = computed(() => (md.value ? 2 : 4))

const collectColumnIntersection = (productId: number, index: number) => {
  const isTracked =
    trackingCollector.value.findIndex((p) => p.id === productId) !== -1

  const isFirstItemInRow = isFirstIndexOfRow(index, columns.value)

  if (isFirstItemInRow && !isTracked) {
    const itemsInSliderRow = [...props.products]
      .slice(index, index + columns.value)
      .map((item, idx) => ({ ...item, index: index + idx }))

    emit('intersect:column', {
      row: index,
      items: itemsInSliderRow,
    })

    trackingCollector.value.push(...itemsInSliderRow)
  }
}
</script>
