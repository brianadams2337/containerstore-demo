<template>
  <div v-if="promotionEngineFeatureEnabled">
    <div :style="backgroundColorStyle" class="rounded-t-md px-3.5 py-3">
      <Headline tag="h2" size="sm" class="text-white" is-bold>
        {{ $t('pdp.promotion.free_gift_headline') }}
      </Headline>
    </div>
    <div class="rounded-b-md border border-gray-350 bg-white py-4">
      <div class="max-h-72 overflow-y-scroll px-3.5" @scroll="onScroll">
        <ProductPromotionGiftItem
          v-for="variant in variantsWithProducts"
          :key="variant.id"
          v-bind="{ variant, backgroundColorStyle }"
          class="mb-4 last-of-type:mb-0"
        />
      </div>
      <div
        class="relative z-20 mx-3.5 mt-4 rounded-md bg-secondary-450 px-4 py-2 text-center"
        :class="shadowClass"
      >
        <p class="text-2xs font-medium uppercase text-gray-750">
          {{ $t('pdp.promotion.free_gift_hint') }}
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Product, BuyXGetYEffect } from '@scayle/storefront-nuxt'

const props = defineProps<{ product: Product }>()

const { promotionEngineFeatureEnabled } = useRuntimeConfig().public

const { buyXGetYPromotion, hasMultipleFreeGifts } = await useProductPromotions(
  props.product,
)

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

const variantIds = computed(() => {
  const { additionalData } = buyXGetYPromotion.value?.effect as BuyXGetYEffect
  return additionalData.variantIds.slice(0, additionalData.maxCount)
})

const backgroundColorStyle = computed(() => {
  return getBackgroundColorStyle(buyXGetYPromotion.value?.customData.colorHex)
})

const { data: variants } = await useVariant({
  params: { ids: variantIds.value },
  key: `promotion-variants-${buyXGetYPromotion.value?.id}`,
})

const { data: products } = await useProductsByIds({
  params: { ids: variants.value.map((it) => it.productId) },
})

const variantsWithProducts = computed(() => {
  return variants.value.map((variant) => ({
    ...variant,
    product: products.value.find((it) => it.id === variant.productId),
  })) as VariantWithProduct[]
})
</script>
