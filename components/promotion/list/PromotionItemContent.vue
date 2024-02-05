<template>
  <div
    class="relative flex flex-col items-start rounded-md bg-blue px-4 py-3 text-white"
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
    <div
      v-if="isPriorityBadgeShown"
      class="absolute bottom-3 right-4 rounded-md border px-2 py-1 text-2xs font-semibold uppercase"
    >
      {{ $t('promotion.highest_priority') }}
    </div>
  </div>
</template>

<script setup lang="ts">
type Props = {
  customData?: Promotion['customData']
  isPriorityBadgeShown?: boolean
  schedule: Promotion['schedule']
}

const props = withDefaults(defineProps<Props>(), {
  customData: () => ({}),
  isPriorityBadgeShown: false,
})

const headlineParts = computed(() => props.customData.headlineParts)
</script>
