<template>
  <SFItemsSlider with-arrows mode="horizontal" data-testid="product-thumbnails">
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
    <div class="flex w-full gap-4">
      <div
        v-for="sibling in siblings"
        :key="sibling.id"
        class="relative size-20 shrink-0 rounded-xl border-2 transition-all hover:border-black md:size-16"
        :class="{
          'border-transparent': sibling.id !== product.id && !sibling.isSoldOut,
          'border-black text-black': sibling.id === product.id,
          'bg-gray-100 text-gray-300 hover:bg-white hover:text-black':
            sibling.id !== product.id,
          'border-gray-200': sibling.isSoldOut && sibling.id !== product.id,
        }"
        @mouseenter="setHoveredLabel(sibling)"
        @mouseleave="setHoveredLabel(undefined)"
      >
        <div
          v-if="sibling.isSoldOut"
          class="absolute size-full rounded-md diagonal-strikethrough"
        />
        <SFLink
          class="p-2"
          :class="{
            'pointer-events-none':
              sibling.isSoldOut || sibling.id === product.id,
          }"
          :to="getProductDetailRoute(sibling.id, name)"
        >
          <ProductImage
            v-if="sibling.image"
            sizes="64px"
            :class="{
              'opacity-20': sibling.isSoldOut && sibling.id !== product.id,
            }"
            :image="sibling.image"
            aspect-ratio="1/1"
          />
        </SFLink>
      </div>
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
          type="slider"
          @click="prev()"
        >
          <IconChevronLeft class="size-4" />
        </SFButton>
        <SFButton
          class="!size-6 rounded-r-full last:!p-0.5"
          :disabled="!isNextEnabled"
          type="slider"
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
import { SFItemsSlider, SFLink } from '#components'
import { useProductBaseInfo, useRouteHelpers } from '~/composables'
import type { ProductSibling } from '~/types/siblings'
import { useI18n } from '#i18n'

type Props = {
  product: Product
}
const { getProductDetailRoute } = useRouteHelpers()

const props = defineProps<Props>()
const { siblings, name } = useProductBaseInfo(props.product)

const hoveredColorLabel = ref()
const { t } = useI18n()

const setHoveredLabel = (sibling: ProductSibling | undefined) => {
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
</script>
