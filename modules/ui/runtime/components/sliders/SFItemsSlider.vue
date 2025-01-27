<template>
  <div
    class="relative"
    :class="{ 'overflow-y-scroll scrollbar-hide': mode === 'vertical' }"
  >
    <slot name="header" />
    <div
      ref="sliderRef"
      class="flex size-full shrink-0 snap-mandatory scrollbar-hide"
      :class="[
        {
          container,
          'space-x-4': spacedItems,
          'snap-y flex-col overflow-x-hidden overflow-y-scroll':
            mode === 'vertical',
          'snap-x overflow-x-auto overflow-y-hidden': mode === 'horizontal',
        },
        sliderClass,
      ]"
      :tabindex="disableFocus ? -1 : 0"
      @scroll.passive="onScroll"
    >
      <slot />
    </div>
    <component :is="divOrTransition" :duration="150">
      <div v-if="withArrows">
        <slot
          name="arrows"
          v-bind="{ prev, isPrevEnabled, next, isNextEnabled, isScrollable }"
        >
          <slot name="prev-button" v-bind="{ prev, isPrevEnabled }">
            <button
              class="absolute rounded-full bg-black p-1 text-white disabled:opacity-10"
              :class="{
                'disabled:hidden': hideDisabledArrows,
                'left-2 top-[40%]': mode === 'horizontal',
                'left-1/2 top-2 -translate-x-1/2 rotate-90':
                  mode === 'vertical',
              }"
              :disabled="!isPrevEnabled"
              @click="prev()"
            >
              <IconChevronLeft class="size-6 p-0.5" />
            </button>
          </slot>
          <slot name="next-button" v-bind="{ next, isNextEnabled }">
            <button
              class="absolute rounded-full bg-black p-1 text-white disabled:opacity-10"
              :class="{
                'disabled:hidden': hideDisabledArrows,
                'right-2 top-[40%]': mode === 'horizontal',
                'bottom-2 left-1/2 -translate-x-1/2 rotate-90':
                  mode === 'vertical',
              }"
              :disabled="!isNextEnabled"
              @click="next()"
            >
              <IconChevronRight class="size-6 p-0.5" />
            </button>
          </slot>
        </slot>
      </div>
    </component>
    <slot
      name="thumbnails"
      :scroll-image-into-view="scrollImageIntoView"
      :active-slide="activeSlide"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, nextTick, computed, type Ref, watch } from 'vue'
import { useMounted } from '@vueuse/core'
import { useItemsSlider } from '#storefront-ui'
import { SFFadeInTransition } from '#storefront-ui/components'

type Props = {
  container?: boolean
  sliderClass?: string
  spacedItems?: boolean
  withArrows?: boolean
  hideDisabledArrows?: boolean
  mode?: 'horizontal' | 'vertical'
  disableFocus?: boolean
}

const {
  container = false,
  spacedItems = false,
  withArrows = false,
  sliderClass = '',
  hideDisabledArrows = false,
  disableFocus = false,
  mode = 'horizontal',
} = defineProps<Props>()

const sliderRef = ref<HTMLElement>()

const isMounted = useMounted()

const {
  next,
  prev,
  isNextEnabled,
  isPrevEnabled,
  onScroll,
  scrollImageIntoView,
  activeSlide,
  isScrollable,
} = useItemsSlider(sliderRef as Ref<HTMLElement>, mode)

const divOrTransition = computed(() => {
  return !isMounted.value ? 'div' : SFFadeInTransition
})

nextTick(() => onScroll())

defineExpose({
  scrollImageIntoView,
})

const emit = defineEmits<{
  (e: 'update:activeSlide', newActiveSlide: number): void
}>()
watch(activeSlide, (newActiveSlide) => {
  emit('update:activeSlide', newActiveSlide)
})
</script>
