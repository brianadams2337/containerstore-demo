<template>
  <div v-if="blok && !fetching" :class="marginClasses">
    <div class="flex w-full justify-between px-5 sm:px-14">
      <SFHeadline v-if="blok?.fields.headline" tag="p" size="base" is-uppercase>
        {{ blok.fields.headline }}
      </SFHeadline>

      <SFLink
        v-if="blok?.fields.ctaUrl && blok.fields.ctaLabel"
        :to="blok.fields.ctaUrl"
      >
        {{ blok.fields.ctaLabel }}
      </SFLink>
    </div>

    <SFHorizontalItemsSlider
      class="mt-4"
      with-arrows
      data-test-id="horizontal-product-slider"
    >
      <CMSProduct
        v-for="(product, index) in products"
        :key="`product-slider-item-${product.id}`"
        class="box-content w-1/2 shrink-0 snap-start snap-always px-px first:pl-5 last:pr-5 sm:w-1/5 sm:px-0.5 sm:first:pl-14 sm:last:pr-14"
        :product="product"
        :fetching="fetching"
        @click:product="trackProductClick({ product: $event, index })"
        @intersect:product="trackIntersection({ product: $event, index })"
      />

      <template #prev-button="{ prev, isPrevEnabled }">
        <button
          class="absolute left-0 top-[40%] rounded-sm bg-black text-white disabled:hidden sm:left-14"
          :disabled="!isPrevEnabled"
          @click="prev(sliderOffset)"
        >
          <IconArrowLeft class="size-8 p-1.5" />
        </button>
      </template>
      <template #next-button="{ next, isNextEnabled }">
        <button
          class="absolute right-0 top-[40%] rounded-sm bg-black text-white disabled:hidden sm:right-14"
          :disabled="!isNextEnabled"
          @click="next(sliderOffset)"
        >
          <IconArrowRight class="size-8 p-1.5" />
        </button>
      </template>
    </SFHorizontalItemsSlider>
  </div>
</template>

<script setup lang="ts">
import { computed, defineOptions, ref } from 'vue'
import {
  type Product,
  getLatestCategory,
  isFirstIndexOfRow,
} from '@scayle/storefront-nuxt'
import { useStorefrontTracking } from '../composables/storefront/useStorefrontTracking'
import { useStorefrontBreakpoints } from '../composables/storefront/useStorefrontBreakpoints'
import type { CMSProductSliderProps } from '../types'
import { useContentfulMargins } from '../composables/useContentfulMargins'
import { useProductsByIds } from '#storefront/composables'
import { usePageState } from '~/composables'
import { useRoute } from '#app/composables/router'

const props = defineProps<CMSProductSliderProps>()

const listingMetaData = {
  name: `ProductSlider-${props.blok?.fields.headline}`,
  id: 'PS',
}

const { marginClasses } = useContentfulMargins(props.blok?.fields.marginTop)

const storefrontBreakpoints = useStorefrontBreakpoints()
const route = useRoute()
const { pageState } = usePageState()

const storefrontTracking = useStorefrontTracking()

const productIds = computed(() => {
  return props.blok?.fields.productIds?.split(',').map(Number).filter(Boolean)
})

const { data, fetching } = useProductsByIds({
  params: {
    ids: productIds.value || [],
    with: {
      attributes: {
        withKey: ['color', 'brand', 'name'],
      },
      variants: {
        attributes: {
          withKey: ['price', 'size'],
        },
        lowestPriorPrice: true,
      },
      images: {
        attributes: {
          withKey: ['imageType', 'imageView', 'imageBackground', 'imageKind'],
        },
      },
      priceRange: true,
      lowestPriorPrice: true,
    },
  },
  key: `productSlider-${props.blok?.fields.uid}`,
})

const trackingCollector = ref<Product[]>([])
const products = computed(() => data.value)
const sliderOffset = computed(() =>
  storefrontBreakpoints && storefrontBreakpoints.isGreaterOrEqual('md')
    ? 56
    : 20,
)
const columns = computed(() =>
  storefrontBreakpoints && storefrontBreakpoints.isGreaterOrEqual('md') ? 5 : 2,
)

const trackingSource = computed(() => {
  const routePath = String(route.fullPath === '/' ? 'home' : route.name)
  return `${routePath}|ProductSlider|${props.blok?.fields.headline}`
})

const trackProductClick = (payload: { product: Product; index: number }) => {
  const { product, index } = payload
  const category = getLatestCategory(product.categories)
  if (!category) {
    return
  }

  storefrontTracking &&
    storefrontTracking.trackSelectItem({
      product,
      category: {
        name: category?.categoryName || '',
        id: category?.categoryId,
      },
      listingMetaData,
      index,
      source: trackingSource.value,
      pagePayload: {
        content_name: route.fullPath,
        page_type: pageState.value.type,
        page_type_id: route.params.id?.toString() || '',
      },
    })
}

const trackIntersection = (payload: { product: Product; index: number }) => {
  const { product, index } = payload
  const isTracked =
    trackingCollector.value.findIndex((p) => p.id === product.id) !== -1
  const isFirstItemInRow = isFirstIndexOfRow(index, columns.value)
  // Threat slider as a special case of product list, track all interesected items at once
  // But instead of checking is row tracked, check per product
  if (!isFirstItemInRow || isTracked) {
    return
  }

  const itemsInSliderRow = [...(data.value || [])]
    .slice(index, index + columns.value)
    .map((item, idx) => ({ ...item, index: index + idx }))

  storefrontTracking &&
    storefrontTracking.trackViewItemList({
      items: itemsInSliderRow,
      listingMetaData,
      source: trackingSource.value,
    })
  trackingCollector.value.push(...itemsInSliderRow)
}

defineOptions({ name: 'CMSProductSlider' })
</script>
