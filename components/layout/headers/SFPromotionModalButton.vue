<template>
  <SFButton
    variant="raw"
    class="rounded-md p-2 hover:bg-gray-100"
    data-testid="promotion-header-button"
    :aria-label="
      promotionCount
        ? $t('promotion.overlay_active', { total: promotionCount })
        : $t('promotion.overlay')
    "
    @click="toggle"
  >
    <template #icon>
      <IconPromotion class="size-6 shrink-0" />
    </template>
    <span class="-ml-1 min-w-[1ch] text-sm font-semibold leading-none">
      <template v-if="promotionCount">
        {{ promotionCount }}
      </template>
    </span>
  </SFButton>
</template>

<script setup lang="ts">
import { useSlideIn } from '~/modules/ui/runtime'
import SFButton from '~/modules/ui/runtime/components/core/SFButton.vue'

defineProps<{
  promotionCount?: number
}>()

const { toggle } = useSlideIn('PromotionSlideIn')
</script>
