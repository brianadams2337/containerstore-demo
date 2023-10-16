<template>
  <div
    :class="{ 'mt-4': hasMarginTop, 'w-full': fullWidth }"
    class="flex space-x-4 overflow-y-auto scrollbar-hide sm:justify-center">
    <BannerLink v-for="link in links" :key="link._uid" :blok="link" />
  </div>
</template>

<script setup lang="ts">
import type { SbBannerLink } from '~/storyblok/types/storyblok'

defineProps({
  links: {
    type: Array as PropType<SbBannerLink[]>,
    required: true,
  },
  hasMarginTop: {
    type: Boolean,
    default: false,
  },
  fullWidth: {
    type: Boolean,
    default: false,
  },
})
</script>
