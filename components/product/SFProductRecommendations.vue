<template>
  <SFItemsSlider with-arrows mode="horizontal">
    <template #header>
      <slot name="header" :title="title">
        <div class="mb-6 text-2xl font-medium text-gray-900 md:px-2">
          {{ title }}
        </div>
      </slot>
    </template>
    <template
      #arrows="{ isPrevEnabled, isNextEnabled, prev, next, isScrollable }"
    >
      <div
        class="absolute -top-1 right-6 flex gap-0.5 md:right-2"
        :class="{ hidden: !isScrollable }"
      >
        <SFButton
          class="rounded-l-full"
          :disabled="!isPrevEnabled"
          size="sm"
          variant="slider"
          :aria-label="$t('slider.previous_label')"
          @click="prev()"
        >
          <IconChevronLeft class="size-4 w-5" />
        </SFButton>
        <SFButton
          class="rounded-r-full"
          :disabled="!isNextEnabled"
          :aria-label="$t('slider.next_label')"
          size="sm"
          variant="slider"
          @click="next()"
        >
          <IconChevronRight class="size-4 w-5" />
        </SFButton>
      </div>
    </template>
    <template #default>
      <template v-if="status === 'success'">
        <div
          v-for="(product, index) in products || []"
          :key="product.id"
          class="w-1/2 shrink-0 snap-start pr-4 md:w-1/3 lg:w-1/4"
        >
          <SFProductCard
            hide-badges
            :product="product"
            multiple-images
            @click="trackProductCardClick(product, index)"
          />
        </div>
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
import SFProductCard from './card/SFProductCard.vue'
import { getDeepestCategoryForTracking } from '~/utils/tracking'
import { usePageState } from '~/composables/usePageState'
import { useTrackingEvents } from '~/composables/useTrackingEvents'
import { useRoute } from '#app/composables/router'
import { useProductsByIds } from '#storefront/composables'
import {
  SFButton,
  SFSkeletonLoader,
  SFItemsSlider,
} from '#storefront-ui/components'
import { PRODUCT_TILE_WITH_PARAMS } from '~/constants'

type Props = {
  title: string
  productIds: number[]
}
const props = defineProps<Props>()

const { data: products, status } = useProductsByIds({
  params: { ids: props.productIds, with: PRODUCT_TILE_WITH_PARAMS },
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
