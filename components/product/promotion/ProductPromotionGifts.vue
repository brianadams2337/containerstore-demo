<template>
  <div v-if="promotionEngineFeatureEnabled">
    <div :style="backgroundColorStyle" class="rounded-t-md px-3.5 py-3">
      <Headline tag="h2" size="sm" class="text-white" is-bold>
        {{ $t('pdp.promotion.free_gift_headline') }}
      </Headline>
    </div>
    <div
      v-if="variants"
      class="rounded-b-md border border-gray-350 bg-white px-3.5 py-4"
    >
      <div
        v-for="variant in variantsWithProducts"
        :key="variant.id"
        class="mb-4 flex items-center"
      >
        <RadioItem
          v-if="hasMultipleFreeGifts"
          v-model="selectedVariantId"
          :value="variant.id"
          class="mr-3"
        />
        <ProductPromotionGiftItem v-bind="{ variant, backgroundColorStyle }" />
      </div>
      <div class="mt-4 rounded-md bg-secondary-450 px-4 py-2 text-center">
        <p class="text-2xs font-medium uppercase text-gray-750">
          {{ $t('pdp.promotion.free_gift_hint') }}
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Variant, Product, BuyXGetYEffect } from '@scayle/storefront-nuxt'

const props = defineProps<{ product: Product }>()

const { promotionEngineFeatureEnabled } = useRuntimeConfig().public

const { backgroundColorStyle, applicablePromotion, hasMultipleFreeGifts } =
  await useProductPromotion(props.product)

const variantIds = computed(() => {
  const { additionalData } = applicablePromotion.value.effect as BuyXGetYEffect
  return additionalData.variantIds.slice(0, additionalData.maxCount)
})

const { data: variants } = await useVariant({
  params: { ids: variantIds.value },
  key: `promotion-variants-${applicablePromotion.value.id}`,
})

const selectedVariantId = useState<Variant>(
  'selected-gift',
  () => variants.value[0].id,
)

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
