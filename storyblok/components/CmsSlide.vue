<template>
  <div>
    <component
      :is="image.component"
      v-for="image in blok.image"
      :key="image._uid"
      class="aspect-[1/1] md:aspect-[9/4]"
      :blok="image"
      :preload="preload" />
  </div>
</template>

<script setup lang="ts">
import { SbSlide } from '~/storyblok/types/storyblok'

defineProps({
  blok: {
    type: Object as PropType<SbSlide>,
    required: true,
  },
  preload: {
    type: Boolean,
    default: false,
  },
})
</script>
