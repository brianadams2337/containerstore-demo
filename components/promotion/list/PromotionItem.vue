<template>
  <div class="relative w-80 min-w-xs overflow-hidden rounded-md border p-2">
    <PromotionActiveBadge v-if="isActive" />
    <div
      class="mb-2 flex flex-col items-start rounded-md bg-blue p-4"
      :style="getBackgroundColorStyle(customData.colorHex)"
    >
      <PromotionHeadline
        v-if="headlineParts"
        :headline-parts="headlineParts"
        size="sm"
        is-column
        class="mb-2"
      />
      <PromotionCountdown :until="schedule.to" />
    </div>
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

const props = withDefaults(defineProps<Props>(), {
  customData: () => ({}),
})

const headlineParts = computed(() => props.customData.headlineParts)
</script>
