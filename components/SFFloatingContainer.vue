<template>
  <SFFadeInTransition v-if="mounted" :duration="150" appear>
    <div :style="bottomSpacingStyle" v-bind="$attrs" class="fixed bottom-0">
      <slot />
    </div>
  </SFFadeInTransition>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useMounted } from '@vueuse/core'
import { usePromotionActions } from '~/composables'
import { useDefaultBreakpoints } from '#storefront-ui/composables'
import { SFFadeInTransition } from '#storefront-ui/components'

const { bottomBannerRef, isPromotionBannerShown } = usePromotionActions()

const { greaterOrEqual } = useDefaultBreakpoints()
const isGreaterOrEqualThanLg = greaterOrEqual('lg')

const mounted = useMounted()

const DEFAULT_BOTTOM_SPACE = 12

const bottomSpacingStyle = computed(() => {
  if (isGreaterOrEqualThanLg.value || !isPromotionBannerShown.value) {
    return { transform: `translateY(-${DEFAULT_BOTTOM_SPACE}px)` }
  }
  const promotionBannerHeight = bottomBannerRef.value?.clientHeight ?? 0
  return {
    transform: `translateY(-${promotionBannerHeight + DEFAULT_BOTTOM_SPACE}px)`,
  }
})
</script>
