<template>
  <div class="relative">
    <div
      ref="sliderRef"
      class="flex size-full shrink-0 snap-x snap-mandatory overflow-x-auto overflow-y-hidden scrollbar-hide"
      :class="[{ container, 'space-x-4': spacedItems }, sliderClass]"
      @scroll="onScroll"
    >
      <slot />
    </div>
    <component :is="divOrTransition" :duration="150">
      <div v-if="withArrows">
        <slot name="prev-button" :prev="prev" :is-prev-enabled="isPrevEnabled">
          <button
            class="absolute left-2 top-[40%] rounded-full bg-black p-1 text-white disabled:opacity-10"
            :class="{ 'disabled:hidden': hideDisabledArrows }"
            :disabled="!isPrevEnabled"
            @click="prev()"
          >
            <IconChevronLeft class="size-6 p-0.5" />
          </button>
        </slot>
        <slot name="next-button" :next="next" :is-next-enabled="isNextEnabled">
          <button
            class="absolute right-2 top-[40%] rounded-full bg-black p-1 text-white disabled:opacity-10"
            :class="{ 'disabled:hidden': hideDisabledArrows }"
            :disabled="!isNextEnabled"
            @click="next()"
          >
            <IconChevronRight class="size-6 p-0.5" />
          </button>
        </slot>
      </div>
    </component>
    <slot name="thumbnails" :scroll-image-into-view="scrollImageIntoView" />
  </div>
</template>

<script setup lang="ts">
import { ref, nextTick, computed, type Ref } from 'vue'
import { useResizeObserver, useMounted } from '@vueuse/core'
import { useHorizontalItemsSlider } from '#storefront-ui'
import { SFFadeInTransition } from '#components'

type Props = {
  container?: boolean
  sliderClass?: string
  spacedItems?: boolean
  withArrows?: boolean
  hideDisabledArrows?: boolean
}
withDefaults(defineProps<Props>(), {
  container: false,
  spacedItems: false,
  withArrows: false,
  sliderClass: '',
  hideDisabledArrows: false,
})

const sliderRef = ref<HTMLElement>()

const isMounted = useMounted()

const {
  next,
  prev,
  isNextEnabled,
  isPrevEnabled,
  onScroll,
  scrollImageIntoView,
} = useHorizontalItemsSlider(sliderRef as Ref<HTMLElement>)

const divOrTransition = computed(() => {
  return !isMounted.value ? 'div' : SFFadeInTransition
})

nextTick(() => onScroll())
useResizeObserver(sliderRef, () => onScroll())
</script>
