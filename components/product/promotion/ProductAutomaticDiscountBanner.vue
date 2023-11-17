<template>
  <div
    v-if="isAutomaticDiscount && promotionEngineFeatureEnabled"
    class="flex h-fit items-center justify-between rounded-md bg-blue px-2 py-1 text-xs font-semibold text-white"
    :style="backgroundColorStyle"
  >
    <Headline tag="h2" size="xs" is-bold is-uppercase>
      {{ $t('promotion.automatic_discount_headline.hurry_to_save') }}
      {{ promotionLabel }}
    </Headline>
    <PromotionCountdown :until="applicablePromotion.schedule.to" borderless />
  </div>
</template>

<script setup lang="ts">
import type { Product } from '@scayle/storefront-nuxt'

const props = defineProps<{ product: Product }>()

const {
  isAutomaticDiscount,
  backgroundColorStyle,
  applicablePromotion,
  promotionLabel,
} = await useProductPromotion(props.product)

const { promotionEngineFeatureEnabled } = useRuntimeConfig().public
</script>
