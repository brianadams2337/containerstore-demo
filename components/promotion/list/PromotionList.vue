<template>
  <div
    ref="promotionListRef"
    data-test-id="promotion-list"
    class="absolute right-0 top-[3.25rem] z-60 hidden w-full lg:block"
  >
    <div class="relative bg-primary p-5 text-white">
      <div class="overflow-x-scroll scrollbar-hide">
        <div class="mx-auto flex w-max items-start">
          <SFHorizontalItemsSlider>
            <PromotionItem
              v-for="item in items"
              :key="item.id"
              :promotion="item"
              class="mr-4 last:mr-0"
            />
          </SFHorizontalItemsSlider>
        </div>
        <ClosePromotionListButton data-test-id="close-promotion-button" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onClickOutside } from '@vueuse/core'
import { ref } from 'vue'
import type { MaybeElementRef } from '@vueuse/core'
import { useDefaultBreakpoints, usePromotionActions } from '~/composables'

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
