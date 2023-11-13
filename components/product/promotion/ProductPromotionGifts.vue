<template>
  <div>
    <div :style="backgroundColorStyle" class="rounded-t-md px-3.5 py-3">
      <Headline tag="h2" size="sm" class="text-white" is-bold>
        {{ $t('pdp.promotion.free_gift_headline') }}
      </Headline>
    </div>
    <div class="rounded-b-md border border-gray-350 bg-white px-3.5 py-4">
      <ProductPromotionGiftItem
        v-for="variant in variantsWithProducts"
        :key="variant.id"
        v-bind="{ variant, backgroundColorStyle }"
      />
      <div class="mt-4 rounded-md bg-secondary-450 px-4 py-2 text-center">
        <p class="text-2xs font-medium uppercase text-gray-750">
          {{ $t('pdp.promotion.free_gift_hint') }}
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Product } from '@scayle/storefront-nuxt'

const props = defineProps<{ product: Product }>()

const { backgroundColorStyle, applicablePromotion } = await useProductPromotion(
  props.product,
)

const additionalData = computed(() => {
  return applicablePromotion.value.effect
    .additionalData as BuyXGetYAdditonalData
})

const variantIds = computed(() => {
  return additionalData.value.variantIds.splice(
    0,
    additionalData.value.maxCount,
  )
})

const { data: variants } = await useVariant({
  params: { ids: variantIds.value },
  key: `promotion-variants-${applicablePromotion.value.id}`,
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
