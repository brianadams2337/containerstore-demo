<template>
  <div
    class="relative flex flex-col items-start rounded-md bg-blue px-4 py-3 text-white"
    :style="getBackgroundColorStyle(customData.colorHex)"
  >
    <SFPromotionHeadline
      v-if="headlineParts"
      :headline-parts="headlineParts"
      size="sm"
      is-column
      class="mb-2"
    />
    <SFPromotionCountdown :time-until="schedule.to" />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import SFPromotionHeadline from '../headlines/SFPromotionHeadline.vue'
import SFPromotionCountdown from '../SFPromotionCountdown.vue'
import { getBackgroundColorStyle } from '~/utils/promotion'
import type { Promotion } from '~/types/promotion'

type Props = {
  customData?: Promotion['customData']
  schedule: Promotion['schedule']
}

const props = withDefaults(defineProps<Props>(), { customData: () => ({}) })

const headlineParts = computed(() => props.customData.headlineParts)
</script>
