<template>
  <SFItemsSlider with-arrows mode="horizontal">
    <template #header>
      <div class="mb-6 px-2 text-2xl font-medium text-gray-900">
        {{ title }}
      </div>
    </template>
    <template
      #arrows="{ isPrevEnabled, isNextEnabled, prev, next, isScrollable }"
    >
      <div
        class="absolute right-0 top-0 flex gap-0.5"
        :class="{ hidden: !isScrollable }"
      >
        <SFButton
          class="rounded-l-full"
          :disabled="!isPrevEnabled"
          size="sm"
          type="slider"
          @click="prev()"
        >
          <IconChevronLeft class="size-4 w-5" />
        </SFButton>
        <SFButton
          class="rounded-r-full"
          :disabled="!isNextEnabled"
          size="sm"
          type="slider"
          @click="next()"
        >
          <IconChevronRight class="size-4 w-5" />
        </SFButton>
      </div>
    </template>
    <template #default>
      <template v-if="status === 'success'">
        <ProductCard
          v-for="(product, index) in products || []"
          :key="product.id"
          :product="product"
          multiple-images
          class="w-1/2 shrink-0 px-2 md:w-1/3 lg:w-1/4"
          @click="trackProductCardClick(product, index)"
        />
      </template>
      <template v-else>
        <SFSkeletonLoader
          v-for="i in 4"
          :key="i"
          class="mx-2 aspect-3/4 w-1/2 shrink-0 md:w-1/3 lg:w-1/4"
          type="custom"
        />
      </template>
    </template>
  </SFItemsSlider>
</template>
<script setup lang="ts">
import type { Product } from '@scayle/storefront-nuxt'
import ProductCard from './card/ProductCard.vue'
import {
  getDeepestCategoryForTracking,
  usePageState,
  useRoute,
  useTrackingEvents,
} from '#imports'
import { useProductsByIds } from '#storefront/composables'
import {
  SFButton,
  SFSkeletonLoader,
  SFItemsSlider,
} from '#storefront-ui/components'

type Props = {
  title: string
  productIds: number[]
}
const props = defineProps<Props>()

const { data: products, status } = useProductsByIds({
  params: { ids: props.productIds },
})

const { trackSelectItem } = useTrackingEvents()
const { pageState } = usePageState()
const route = useRoute()
const trackProductCardClick = (product: Product, index: number) => {
  trackSelectItem({
    product,
    category: getDeepestCategoryForTracking(product.categories),
    index,
    soldOut: product.isSoldOut,
    pagePayload: {
      content_name: route.fullPath,
      page_type: pageState.value.type,
      page_type_id: pageState.value.typeId,
    },
  })
}
</script>
