<template>
  <div
    v-if="promotionLabel && productPromotionId"
    class="h-fit w-fit rounded-md bg-blue p-1 px-2 text-xs font-semibold text-white"
    :style="backgroundColorStyle"
  >
    {{ promotionLabel }}
  </div>
</template>

<script setup lang="ts">
import type { Product } from '@scayle/storefront-nuxt'

const props = defineProps<{ product: Product }>()

const { backgroundColorStyle, promotionLabel, productPromotionId } =
  await useProductPromotion(props.product)
</script>
