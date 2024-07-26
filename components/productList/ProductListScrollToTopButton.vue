<template>
  <Teleport to="body">
    <SFFadeInTransition :duration="150">
      <SFButton
        v-if="!arrivedState.top"
        type="secondary"
        class="fixed bottom-0 right-4 z-100 size-12 rounded-xl !p-0 !text-gray-400 transition-transform duration-150 ease-in-out md:size-9"
        :style="bottomSpacingStyle"
        @click="scrollToTop"
      >
        <template #icon>
          <IconChevronUp class="size-5 md:size-3" />
        </template>
      </SFButton>
    </SFFadeInTransition>
  </Teleport>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useScroll } from '@vueuse/core'
import { usePromotionActions, useDefaultBreakpoints } from '~/composables'

const DEFAULT_BOTTOM_SPACE = 12

const { arrivedState } = useScroll(window)

const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' })

const { bottomBannerRef, isPromotionBannerShown } = usePromotionActions()

const { greaterOrEqual } = useDefaultBreakpoints()

const isGreaterOrEqualThanLg = greaterOrEqual('lg')

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
