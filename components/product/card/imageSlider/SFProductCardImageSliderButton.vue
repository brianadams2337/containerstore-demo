<template>
  <button
    class="absolute p-2 text-gray-400 transition-transform duration-300 focus-within:shadow-secondary hover:text-gray-900 focus-visible:shadow-outer-solid disabled:hover:translate-x-0 disabled:hover:text-gray-400"
    :class="{
      '-left-2 rounded-r-full hover:translate-x-1': isLeft,
      '-right-2 rounded-l-full hover:-translate-x-1': !isLeft,
    }"
    :disabled="disabled"
    :aria-label="ariaLabel"
  >
    <component :is="icon" class="size-4" />
  </button>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { IconChevronLeft, IconChevronRight } from '#components'
import { useI18n } from '#i18n'

const { direction } = defineProps<{
  disabled: boolean
  direction: 'left' | 'right'
}>()

const { t } = useI18n()

const isLeft = computed(() => direction === 'left')
const icon = computed(() => (isLeft.value ? IconChevronLeft : IconChevronRight))

const ariaLabel = computed(() => {
  return isLeft.value
    ? t('image_slider.previous_label')
    : t('image_slider.next_label')
})
</script>
