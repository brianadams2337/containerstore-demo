<template>
  <div
    class="flex items-center justify-center gap-2 border-t-2 border-t-gray-500 bg-white px-4 py-5 sm:rounded-md sm:border-2 sm:border-gray-400 sm:py-3">
    <ProductImage
      v-for="(image, idx) in images"
      :key="image.hash"
      type="button"
      class="relative z-10 hidden h-20 cursor-pointer transition-opacity sm:block"
      :class="idx === activeIndex ? 'opacity-100' : 'opacity-50'"
      :hash="image.hash"
      :image="image"
      sizes="sm:50vw"
      fit="contain"
      :quality="30"
      @click="emit('click:thumbnail', idx)" />
    <div
      v-for="(image, idx) in images"
      :key="`thumbnail-rounded-${image.hash}`"
      class="h-2 w-2 rounded-full sm:hidden"
      :class="idx === activeIndex ? 'bg-black' : 'bg-gray-500'" />
  </div>
</template>

<script setup lang="ts">
import type { ProductImage } from '@scayle/storefront-nuxt'

defineProps({
  images: {
    type: Array as PropType<ProductImage[]>,
    required: true,
  },
  activeIndex: {
    type: Number,
    default: 0,
  },
})

const emit = defineEmits<{
  (e: 'click:thumbnail', value: number): void
}>()
</script>
