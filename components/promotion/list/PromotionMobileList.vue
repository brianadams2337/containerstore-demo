<template>
  <div
    :ref="(element) => setBannerRef(element as HTMLElement, 'bottom')"
    class="fixed bottom-0 right-0 z-60 w-full overflow-hidden rounded-t-xl lg:hidden"
  >
    <div class="relative flex flex-col bg-primary px-4 pb-4 text-white">
      <div class="flex justify-center p-4">
        <SFHeadline tag="h2" size="lg">
          {{ $t('promotion.my_deals_label') }} ({{ items.length }})
        </SFHeadline>
        <ClosePromotionListButton position-class="right-5 top-3" />
      </div>
      <SFHorizontalItemsSlider>
        <PromotionItem
          v-for="item in items"
          :key="item.id"
          :promotion="item"
          class="mr-4 last-of-type:mr-0"
        />
      </SFHorizontalItemsSlider>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onClickOutside } from '@vueuse/core'
import { useDefaultBreakpoints, usePromotionActions } from '~/composables'

defineProps<{ items: Promotion[] }>()

const viewport = useDefaultBreakpoints()

const {
  togglePromotionList: toggle,
  setBannerRef,
  bottomBannerRef,
} = usePromotionActions()

onClickOutside(bottomBannerRef, () => viewport.isSmaller('lg') && toggle())
</script>
