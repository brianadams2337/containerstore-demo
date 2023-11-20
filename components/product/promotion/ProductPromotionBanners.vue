<template>
  <div
    v-if="promotionEngineFeatureEnabled"
    class="flex w-full max-w-sm flex-col"
  >
    <PromotionItemContent
      v-for="{ id, customData, schedule } in applicablePromotions"
      :key="id"
      v-bind="{ customData, schedule }"
      class="mb-2 w-full"
    />
  </div>
</template>

<script setup lang="ts">
import type { Product } from '@scayle/storefront-nuxt'

const props = defineProps<{ product: Product }>()

const { applicablePromotions } = await useProductPromotions(props.product)

const { promotionEngineFeatureEnabled } = useRuntimeConfig().public
</script>
