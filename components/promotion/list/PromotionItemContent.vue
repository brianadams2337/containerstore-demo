<template>
  <div
    class="relative flex flex-col items-start rounded-md bg-blue p-4 text-white"
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
    <IconInfoOutline class="absolute right-2 top-2 mr-1 h-5 w-5" />
  </div>
</template>

<script setup lang="ts">
type Props = {
  customData?: Promotion['customData']
  schedule: Promotion['schedule']
}

const props = withDefaults(defineProps<Props>(), {
  customData: () => ({}),
})

const headlineParts = computed(() => props.customData.headlineParts)
</script>
