<template>
  <div
    ref="promotionListRef"
    class="fixed right-0 top-[3.25rem] z-60 hidden w-full lg:block"
  >
    <div class="relative bg-primary p-5 text-white">
      <div class="overflow-x-scroll scrollbar-hide">
        <div class="mx-auto flex w-max items-start">
          <PromotionItem
            v-for="item in items"
            :key="item.id"
            v-bind="item"
            class="mr-4 last-of-type:mr-0"
          />
        </div>
        <ClosePromotionListButton />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { MaybeElementRef } from '@vueuse/core'

defineProps<{ items: Promotion[] }>()

const promotionListRef = ref()

const viewport = useViewport()

const { togglePromotionList: toggle, topBannerRef } = usePromotionActions()

onClickOutside(
  promotionListRef,
  () => viewport.isGreaterOrEquals('lg') && toggle(),
  { ignore: [topBannerRef as MaybeElementRef] },
)
</script>
