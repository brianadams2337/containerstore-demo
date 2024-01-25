<template>
  <div class="flex w-full flex-col">
    <template
      v-for="{ id, customData, schedule, priority } in applicablePromotions"
      :key="id"
    >
      <component
        :is="getComponentName(customData.category)"
        v-bind="getAttributes(customData.category)"
      >
        <PromotionItemContent
          :key="id"
          v-bind="{ customData, schedule }"
          :is-priority-badge-shown="isHighestPriority(priority)"
          class="mb-2 w-full"
        />
      </component>
    </template>
  </div>
</template>

<script setup lang="ts">
import type { Product } from '@scayle/storefront-nuxt'

const props = defineProps<{ product: Product }>()

const { applicablePromotions, isHighestPriority } = await useProductPromotions(
  props.product,
)

const getComponentName = (to?: string) => {
  return to ? resolveComponent('DefaultLink') : 'div'
}

const getAttributes = (to?: string) => ({ ...(to && { raw: true, to }) })
</script>
