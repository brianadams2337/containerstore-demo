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
import { SlideStoryblok } from '../types/component-types-sb'

defineProps({
  blok: {
    type: Object as PropType<SlideStoryblok>,
    required: true,
  },
  preload: {
    type: Boolean as PropType<boolean>,
    default: false,
  },
})
</script>
