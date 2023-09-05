<template>
  <div
    :class="{ 'mt-4': hasMarginTop, 'w-full': fullWidth }"
    class="flex space-x-4 overflow-y-auto scrollbar-hide sm:justify-center">
    <BannerLink v-for="link in links" :key="link._uid" :blok="link" />
  </div>
</template>

<script setup lang="ts">
import { BannerLinkStoryblok } from '~/storyblok/types/component-types-sb'
defineProps({
  links: {
    type: Array as PropType<BannerLinkStoryblok[]>,
    required: true,
  },
  hasMarginTop: {
    type: Boolean as PropType<boolean>,
    default: false,
  },
  fullWidth: {
    type: Boolean as PropType<boolean>,
    default: false,
  },
})
</script>
