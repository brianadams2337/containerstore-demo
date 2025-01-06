<template>
  <SFItemsSlider
    with-arrows
    mode="horizontal"
    data-testid="product-thumbnails"
    disable-focus
  >
    <template #header>
      <div class="mb-4 flex justify-between">
        <div class="flex gap-2 text-md">
          <span class="font-semi-bold-variable">
            {{ $t('pdp.color_heading') }}:
          </span>
          <span>{{ label }}</span>
        </div>
      </div>
    </template>
    <div class="flex w-full gap-4 py-1.5">
      <SFLink
        v-for="(sibling, index) in siblings"
        :key="sibling.id"
        class="relative size-20 shrink-0 rounded-xl border-2 p-2 transition-all supports-hover:hover:border-black md:size-16"
        :class="{
          'pointer-events-none': sibling.isSoldOut || sibling.id === product.id,
          'border-transparent': sibling.id !== product.id && !sibling.isSoldOut,
          'border-black text-black -outline-offset-4 focus-visible:shadow-inner-solid':
            sibling.id === product.id,
          'bg-gray-100 text-gray-300 supports-hover:hover:bg-white supports-hover:hover:text-black':
            sibling.id !== product.id,
          'border-gray-200': sibling.isSoldOut && sibling.id !== product.id,
        }"
        :to="getProductDetailRoute(sibling.id, sibling.name)"
        @mouseenter="setHoveredLabel(sibling)"
        @mouseleave="setHoveredLabel()"
        @click="trackSiblingClick(sibling, index)"
      >
        <div
          v-if="sibling.isSoldOut"
          class="absolute left-0 size-full rounded-md diagonal-strikethrough"
        />

        <ProductImage
          v-if="sibling.image"
          :alt="siblingAltText(sibling)"
          sizes="64px"
          :class="{
            'opacity-20': sibling.isSoldOut && sibling.id !== product.id,
          }"
          :image="sibling.image"
          aspect-ratio="1/1"
        />
      </SFLink>
    </div>
    <template
      #arrows="{ isPrevEnabled, isNextEnabled, prev, next, isScrollable }"
    >
      <div
        class="absolute right-0 top-0 flex gap-0.5 max-md:hidden"
        :class="{ hidden: !isScrollable }"
      >
        <SFButton
          class="!size-6 rounded-l-full first:!p-0.5"
          :disabled="!isPrevEnabled"
          :aria-label="$t('slider.previous_label')"
          variant="slider"
          @click="prev()"
        >
          <IconChevronLeft class="size-4" />
        </SFButton>
        <SFButton
          class="!size-6 rounded-r-full last:!p-0.5"
          :aria-label="$t('slider.next_label')"
          :disabled="!isNextEnabled"
          variant="slider"
          @click="next()"
        >
          <IconChevronRight class="size-4" />
        </SFButton>
      </div>
    </template>
  </SFItemsSlider>
</template>

<script setup lang="ts">
import type { Product } from '@scayle/storefront-nuxt'
import { computed, ref, defineProps } from 'vue'
import ProductImage from './ProductImage.vue'
import { useRoute } from '#app/composables/router'
import { SFItemsSlider, SFLink, SFButton } from '#storefront-ui/components'
import {
  usePageState,
  useProductBaseInfo,
  useRouteHelpers,
  useTrackingEvents,
} from '~/composables'
import type { ProductSibling } from '~/types/siblings'
import { useI18n } from '#i18n'
import { productListingMetaData } from '~/constants/product'
import { formatColors } from '~/utils'

type Props = {
  product: Product
}
const { getProductDetailRoute } = useRouteHelpers()

const props = defineProps<Props>()
const { siblings } = useProductBaseInfo(props.product)

const hoveredColorLabel = ref()
const { t } = useI18n()

const setHoveredLabel = (sibling?: ProductSibling) => {
  if (!sibling) {
    hoveredColorLabel.value = undefined
    return
  }

  hoveredColorLabel.value =
    sibling.colors?.[0]?.label?.toLowerCase() || t('pdp.sibling_error')
}

const label = computed(() => {
  const firstSiblingColors = siblings.value[0]?.colors

  if (!firstSiblingColors?.length) {
    return t('pdp.sibling_error')
  }

  return hoveredColorLabel.value || firstSiblingColors[0].label.toLowerCase()
})

const siblingAltText = (sibling: ProductSibling) => {
  return t(
    sibling.isSoldOut
      ? 'product_image.alt_sibling_sold_out'
      : 'product_image.alt_sibling',
    {
      alt: t('product_image.alt', {
        productName: sibling.name,
        colors: formatColors(sibling.colors),
        brand: sibling.brand,
      }),
      selected: t(
        props.product.id === sibling.id
          ? 'product_image.selected'
          : 'product_image.unselected',
      ),
    },
  )
}

const { pageState } = usePageState()
const route = useRoute()
const trackSiblingClick = (sibling: ProductSibling, index: number) => {
  const siblingsProduct = props.product.siblings?.find(
    (product) => product.id === sibling.id,
  )
  if (!siblingsProduct) {
    return
  }
  try {
    useTrackingEvents().trackSelectItem({
      product: siblingsProduct,
      listingMetaData: productListingMetaData,
      index,
      soldOut: sibling.isSoldOut,
      pagePayload: {
        content_name: route.fullPath,
        page_type: pageState.value.type,
        page_type_id: pageState.value.typeId,
      },
    })
  } catch (e) {
    console.error(e)
  }
}
</script>
