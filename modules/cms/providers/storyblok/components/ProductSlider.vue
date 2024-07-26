<template>
  <div v-editable="blok" :class="marginClasses">
    <div class="flex w-full justify-between px-5 sm:px-14">
      <SFHeadline v-if="blok.headline" tag="p" size="base" is-uppercase>
        {{ blok.headline }}
      </SFHeadline>

      <SFLink v-if="blok.cta_url && blok.cta_label" :to="blok.cta_url">
        {{ blok.cta_label }}
      </SFLink>
    </div>
    <SFHorizontalItemsSlider
      class="mt-4"
      with-arrows
      hide-disabled-arrows
      data-testid="horizontal-product-slider"
    >
      <CMSProduct
        v-for="(product, index) in products"
        :key="`product-slider-item-${product.id}`"
        class="box-content w-1/2 shrink-0 snap-start snap-always px-px first:pl-5 last:pr-5 sm:w-1/5 sm:px-0.5 sm:first:pl-14 sm:last:pr-14"
        v-bind="{ product, fetching }"
        @click:product="trackProductClick({ product: $event, index })"
        @intersect:product="trackIntersection({ product: $event, index })"
      />
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
import { useStorefrontTracking } from '../../../composables/storefront/useStorefrontTracking'
import { useStorefrontBreakpoints } from '../../../composables/storefront/useStorefrontBreakpoints'
import type { CMSProductSliderProps } from '../types'
import { useStoryblokMargins } from '../composables/useStoryblokMargins'
import CMSProduct from './Product.vue'
import {
  useProductsByIds,
  useProductsByReferenceKeys,
} from '#storefront/composables'
import { usePageState } from '~/composables/usePageState'
import { useRoute } from '#app/composables/router'

const props = defineProps<CMSProductSliderProps>()

const listingMetaData = {
  name: `ProductSlider-${props.blok.headline}`,
  id: 'PS',
}

const { marginClasses } = useStoryblokMargins(props.blok)

const storefrontBreakpoints = useStorefrontBreakpoints()
const route = useRoute()
const { pageState } = usePageState()

const storefrontTracking = useStorefrontTracking()

const productIds = computed(() => {
  return props.blok.product_ids?.split(',').map(Number).filter(Boolean)
})

const productReferenceKeys = computed(() => {
  return props.blok.products
    ?.map((product) => product.referenceKey)
    .filter(Boolean) as string[]
})

const productSliderWithParams = {
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
}

const isUsingReferenceKeys = computed(() => {
  return props.blok.products && props.blok.products.length > 0
})

const { data, fetching } = isUsingReferenceKeys.value
  ? await useProductsByReferenceKeys({
      params: {
        referenceKeys: productReferenceKeys.value || [],
        with: productSliderWithParams,
      },
      key: `productSlider-${props.blok._uid}`,
    })
  : await useProductsByIds({
      params: {
        ids: productIds.value || [],
        with: productSliderWithParams,
      },
      key: `productSlider-${props.blok._uid}`,
    })

const trackingCollector = ref<Product[]>([])
const products = computed(() => {
  if (isUsingReferenceKeys.value) {
    // If products are fetched by reference keys, maintain the same order
    return productReferenceKeys.value
      ?.map(
        (referenceKey) =>
          data.value?.find((product) => product.referenceKey === referenceKey),
      )
      .filter(Boolean) as Product[]
  }

  return data.value
})

const columns = computed(() =>
  storefrontBreakpoints && storefrontBreakpoints.isGreaterOrEqual('md') ? 5 : 2,
)

const trackingSource = computed(() => {
  const routePath = String(route.fullPath === '/' ? 'home' : route.name)
  return `${routePath}|ProductSlider|${props.blok.headline}`
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
