<template>
  <div>
    <div :style="backgroundColorStyle" class="rounded-t-md px-3.5 py-3">
      <Headline tag="h2" size="sm" class="text-white" is-bold>
        {{ $t('pdp.promotion.free_gift_headline') }}
      </Headline>
    </div>
    <div class="rounded-b-md border border-gray-350 bg-white pt-4">
      <div class="max-h-72 overflow-y-scroll px-3.5" @scroll="onScroll">
        <ProductPromotionGiftItem
          v-for="(item, index) in products"
          :key="item.id"
          v-bind="{ backgroundColorStyle, isProductAddedToBasket }"
          :eager-image-loading="index < 2"
          :product="item"
          class="mb-4 last-of-type:mb-0"
        />
      </div>
      <div
        class="relative z-20 mt-4 px-4 py-2 text-center"
        :class="shadowClass"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Product } from '@scayle/storefront-nuxt'

const props = defineProps<{ product: Product }>()

const { isProductAddedToBasket } = await useProductPromotions(props.product)

const { backgroundColorStyle, products, hasMultipleFreeGifts } =
  await usePromotionGifts(props.product)

const hasScrolledToBottom = ref(false)

const onScroll = (element: any) => {
  hasScrolledToBottom.value = isScrolledToBottom(element)
}

const shadowClass = computed(() => {
  return (
    hasMultipleFreeGifts.value &&
    !hasScrolledToBottom.value &&
    'top-white-shadow'
  )
})
</script>
