<template>
  <div class="relative">
    <div
      ref="slider"
      class="flex h-full w-full shrink-0 snap-x snap-mandatory overflow-x-auto overflow-y-hidden scrollbar-hide"
      :class="{
        container,
        'space-x-4': spacedItems,
      }"
      @scroll="onScroll">
      <slot />
    </div>
    <template v-if="withArrows">
      <slot name="prevButton" :prev="prev" :is-prev-enabled="isPrevEnabled">
        <button
          class="absolute left-0 top-[40%] rounded-sm bg-black text-white disabled:hidden"
          :disabled="!isPrevEnabled"
          @click="prev()">
          <IconArrowLeft class="h-8 w-8 p-1" />
        </button>
      </slot>
      <slot name="nextButton" :next="next" :is-next-enabled="isNextEnabled">
        <button
          class="absolute right-0 top-[40%] rounded-sm bg-black text-white disabled:hidden"
          :disabled="!isNextEnabled"
          @click="next()">
          <IconArrowRight class="h-8 w-8 p-1" />
        </button>
      </slot>
    </template>
  </div>
</template>

<script setup lang="ts">
defineProps({
  container: {
    type: Boolean as PropType<boolean>,
    default: false,
  },
  spacedItems: {
    type: Boolean as PropType<boolean>,
    default: false,
  },
  withArrows: {
    type: Boolean as PropType<boolean>,
    default: false,
  },
})

const slider = ref()
/**
 * This is because scrollTop/scrollLeft are non-rounded
 * numbers, while scrollHeight/scrollWidth and clientHeight/clientWidth are rounded.
 * https://developer.mozilla.org/en-US/docs/Web/API/Element/scrollHeight#determine_if_an_element_has_been_totally_scrolled
 */
const ARRIVED_STATE_THRESHOLD_PIXELS = 1

const arrivedRight = ref(false)
const arrivedLeft = ref(true)
const x = ref(0)

const onScroll = () => {
  if (process.server) {
    return
  }
  const scrollLeft = slider.value?.scrollLeft
  arrivedRight.value =
    scrollLeft + slider.value.clientWidth >=
    slider.value.scrollWidth - ARRIVED_STATE_THRESHOLD_PIXELS
  arrivedLeft.value = scrollLeft <= 0
  x.value = scrollLeft
}

nextTick(() => onScroll())
useResizeObserver(slider, () => {
  onScroll()
})

const getSlideWidth = () => {
  const slideCount = slider.value.children.length
  return slider.value.scrollWidth / slideCount
}

const next = (offset = 0) => {
  if (!isNextEnabled.value) {
    return
  }

  slider.value.scrollTo({
    top: 0,
    left: x.value + getSlideWidth() + offset,
    behavior: 'smooth',
  })
}
const prev = (offset = 0) => {
  if (!isPrevEnabled.value) {
    return
  }

  slider.value.scrollTo({
    top: 0,
    left: x.value - getSlideWidth() + offset,
    behavior: 'smooth',
  })
}

const isNextEnabled = computed(() => {
  return !arrivedRight.value
})

const isPrevEnabled = computed(() => {
  return !arrivedLeft.value
})
</script>
