<template>
  <div
    class="w-min max-w-[70%] truncate rounded-sm p-1 text-xs leading-none"
    :style="style"
  >
    {{ text ? text : $t('promotion.deal') }}
  </div>
</template>

<script setup lang="ts">
import { FALLBACK_PROMOTION_COLORS, type PromotionStyle } from '~/utils'

const {
  text,
  style = {
    backgroundColor: FALLBACK_PROMOTION_COLORS.background,
    color: FALLBACK_PROMOTION_COLORS.text,
  },
} = defineProps<{
  text?: string
  style?: PromotionStyle
}>()
</script>
