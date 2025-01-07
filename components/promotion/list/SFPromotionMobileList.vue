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
        <SFClosePromotionListButton
          position-class="right-5 top-3"
          data-testid="close-promotion-button-mobile"
        />
      </div>
      <SFItemsSlider>
        <SFPromotionItem
          v-for="item in items"
          :key="item.id"
          :promotion="item"
          class="mr-4 last-of-type:mr-0"
          data-testid="promotion-list-mobile"
        />
      </SFItemsSlider>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onClickOutside } from '@vueuse/core'
import SFClosePromotionListButton from '../buttons/SFClosePromotionListButton.vue'
import SFPromotionItem from './SFPromotionItem.vue'
import { usePromotionActions } from '~/composables'
import { useDefaultBreakpoints } from '#storefront-ui/composables'
import { SFItemsSlider, SFHeadline } from '#storefront-ui/components'
import type { Promotion } from '~/types/promotion'

defineProps<{ items: Promotion[] }>()

const viewport = useDefaultBreakpoints()

const {
  togglePromotionList: toggle,
  setBannerRef,
  bottomBannerRef,
} = usePromotionActions()

onClickOutside(bottomBannerRef, () => viewport.isSmaller('lg') && toggle())
</script>
