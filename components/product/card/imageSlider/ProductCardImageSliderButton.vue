<template>
  <button
    class="absolute top-[40%] bg-white p-2 text-gray-400 shadow-secondary transition-transform duration-300 hover:bg-white hover:text-gray-900 disabled:hover:translate-x-0 disabled:hover:text-gray-400"
    :class="{
      '-left-2 rounded-r-full hover:translate-x-1': isLeft,
      '-right-2 rounded-l-full hover:-translate-x-1': direction === 'right',
    }"
    :disabled="disabled"
    :aria-label="ariaLabel"
  >
    <component :is="icon" class="size-4" />
  </button>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useNuxtApp } from '#app/nuxt'
import { IconChevronLeft, IconChevronRight } from '#components'

const props = defineProps<{ disabled: boolean; direction: 'left' | 'right' }>()

const { $i18n } = useNuxtApp()

const isLeft = computed(() => props.direction === 'left')
const icon = computed(() => (isLeft.value ? IconChevronLeft : IconChevronRight))

const ariaLabel = computed(() => {
  return isLeft.value
    ? $i18n.t('image_slider.previous_label')
    : $i18n.t('image_slider.next_label')
})
</script>
