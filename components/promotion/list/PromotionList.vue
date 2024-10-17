<template>
  <div
    ref="promotionListRef"
    data-testid="promotion-list"
    class="absolute right-0 top-[3.25rem] z-60 hidden w-full lg:block"
  >
    <div class="relative bg-primary p-5 text-white">
      <div class="overflow-x-scroll scrollbar-hide">
        <div class="mx-auto flex w-max items-start">
          <SFItemsSlider>
            <PromotionItem
              v-for="item in items"
              :key="item.id"
              :promotion="item"
              class="mr-4 last:mr-0"
              :data-testid="`promotion-item-${item.id}`"
            />
          </SFItemsSlider>
        </div>
        <ClosePromotionListButton data-testid="close-promotion-button" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onClickOutside } from '@vueuse/core'
import { ref } from 'vue'
import type { MaybeElementRef } from '@vueuse/core'
import ClosePromotionListButton from '../buttons/ClosePromotionListButton.vue'
import PromotionItem from './PromotionItem.vue'
import { useDefaultBreakpoints, usePromotionActions } from '~/composables'
import { SFItemsSlider } from '#storefront-ui/components'
import type { Promotion } from '~/types/promotion'

defineProps<{ items: Promotion[] }>()

const promotionListRef = ref()

const viewport = useDefaultBreakpoints()

const { togglePromotionList: toggle, topBannerRef } = usePromotionActions()

onClickOutside(
  promotionListRef,
  () => viewport.isGreaterOrEqual('lg') && toggle(),
  { ignore: [topBannerRef as MaybeElementRef] },
)
</script>
