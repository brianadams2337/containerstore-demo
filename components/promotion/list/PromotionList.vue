<template>
  <div
    ref="promotionListRef"
    data-test-id="promotion-list"
    class="absolute right-0 top-[3.25rem] z-60 hidden w-full lg:block"
  >
    <div class="relative bg-primary p-5 text-white">
      <div class="overflow-x-scroll scrollbar-hide">
        <div class="mx-auto flex w-max items-start">
          <PromotionItem
            v-for="item in items"
            :key="item.id"
            v-bind="item"
            class="mr-4 last:mr-0"
          />
        </div>
        <ClosePromotionListButton data-test-id="close-promotion-button" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { MaybeElementRef } from '@vueuse/core'

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
