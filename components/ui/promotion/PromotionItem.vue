<template>
  <div class="relative w-80 min-w-xs overflow-hidden rounded-md border p-2">
    <PromotionActiveChip v-if="isActive" />
    <div
      class="mb-2 flex flex-col items-start rounded-md bg-blue p-4"
      :style="getBackgroundColorStyle(customData.colorHex)">
      <PromotionHeadline
        v-if="headlineParts"
        :headline-parts="headlineParts"
        size="sm"
        is-column
        class="mb-2" />
      <PromotionCountdown :until="schedule.to" />
    </div>
    <PromotionItemTerms
      v-if="customData.terms"
      :content="customData.terms"
      :promotion-id="id" />
  </div>
</template>

<script setup lang="ts">
const props = defineProps({
  id: {
    type: String as PropType<Promotion['id']>,
    required: true,
  },
  isActive: {
    type: Boolean as PropType<Promotion['isActive']>,
    required: true,
  },
  customData: {
    type: Object as PropType<Promotion['customData']>,
    default: () => ({}),
  },
  schedule: {
    type: Object as PropType<Promotion['schedule']>,
    required: true,
  },
})

const headlineParts = computed(() => props.customData.headlineParts)
</script>
