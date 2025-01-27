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
import { usePromotionBanner, usePromotionActions } from '~/composables'
import { useDefaultBreakpoints } from '#storefront-ui/composables'
import { SFFadeInTransition } from '#storefront-ui/components'

const { bannerHeight: promotionBannerHeight } = usePromotionBanner()
const { isPromotionBannerShown } = usePromotionActions()

const { greaterOrEqual } = useDefaultBreakpoints()
const isGreaterOrEqualThanLg = greaterOrEqual('lg')

const mounted = useMounted()

const DEFAULT_BOTTOM_SPACE = 58

const bottomSpacingStyle = computed(() => ({
  transform:
    isGreaterOrEqualThanLg.value || !isPromotionBannerShown.value
      ? 'translateY(-28px)'
      : `translateY(-${promotionBannerHeight.value + DEFAULT_BOTTOM_SPACE}px)`,
}))
</script>
