<template>
  <div class="relative">
    <div
      ref="sliderRef"
      class="flex size-full shrink-0 snap-x snap-mandatory overflow-x-auto overflow-y-hidden scrollbar-hide"
      :class="{
        container,
        'space-x-4': spacedItems,
      }"
      @scroll="onScroll"
    >
      <slot />
    </div>
    <template v-if="withArrows">
      <slot name="prev-button" :prev="prev" :is-prev-enabled="isPrevEnabled">
        <button
          class="absolute left-2 top-[40%] rounded-full bg-black p-1 text-white disabled:opacity-10"
          :disabled="!isPrevEnabled"
          @click="prev()"
        >
          <IconArrowLeft class="size-5 p-1" />
        </button>
      </slot>
      <slot name="next-button" :next="next" :is-next-enabled="isNextEnabled">
        <button
          class="absolute right-2 top-[40%] rounded-full bg-black p-1 text-white disabled:opacity-10"
          :disabled="!isNextEnabled"
          @click="next()"
        >
          <IconArrowRight class="size-5 p-1" />
        </button>
      </slot>
    </template>
  </div>
</template>

<script setup lang="ts">
import { useResizeObserver } from '@vueuse/core'
import { nextTick } from 'vue'
import { useHorizontalItemsSlider } from '#storefront-ui'

type Props = {
  container?: boolean
  spacedItems?: boolean
  withArrows?: boolean
}
withDefaults(defineProps<Props>(), {
  container: false,
  spacedItems: false,
  withArrows: false,
})

const { sliderRef, next, prev, isNextEnabled, isPrevEnabled, onScroll } =
  useHorizontalItemsSlider()

nextTick(() => onScroll())
useResizeObserver(sliderRef, () => onScroll())
</script>
