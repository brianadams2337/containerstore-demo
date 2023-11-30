<template>
  <div class="flex w-full max-w-sm flex-col">
    <PromotionItemContent
      v-for="{ id, customData, schedule, priority } in applicablePromotions"
      :key="id"
      v-bind="{ customData, schedule }"
      :is-priority-badge-shown="isHighestPriority(priority)"
      class="mb-2 w-full"
    />
  </div>
</template>

<script setup lang="ts">
import type { Product } from '@scayle/storefront-nuxt'

const props = defineProps<{ product: Product }>()

const { applicablePromotions, isHighestPriority } = await useProductPromotions(
  props.product,
)
</script>
