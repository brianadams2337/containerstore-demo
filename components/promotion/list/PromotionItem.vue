<template>
  <div class="relative w-80 min-w-xs overflow-hidden rounded-md border p-2">
    <PromotionActiveBadge v-if="isActive" class="absolute left-0 top-0 z-20" />
    <PromotionItemContent v-bind="{ customData, schedule }" class="mb-2" />
    <PromotionItemTerms
      v-if="customData.terms"
      :content="customData.terms"
      :promotion-id="id"
    />
  </div>
</template>

<script setup lang="ts">
type Props = {
  id: Promotion['id']
  isActive: Promotion['isActive']
  customData?: Promotion['customData']
  schedule: Promotion['schedule']
}

withDefaults(defineProps<Props>(), { customData: () => ({}) })
</script>
