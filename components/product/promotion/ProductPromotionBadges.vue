<template>
  <div v-if="productPromotionId" class="flex h-fit flex-col">
    <template v-for="{ id, customData } in applicablePromotions">
      <div
        v-if="customData.product?.badgeLabel"
        :key="id"
        class="mb-1 h-fit w-fit rounded-md bg-blue p-1 px-2 text-xs font-semibold text-white last-of-type:mb-0"
        :style="getBackgroundColorStyle(customData.colorHex)"
      >
        {{ customData.product?.badgeLabel }}
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import type { Product } from '@scayle/storefront-nuxt'

const props = defineProps<{ product: Product }>()
const { productPromotionId, applicablePromotions } = await useProductPromotions(
  props.product,
)
</script>
