<template>
  <div
    :class="{ 'mt-4': hasMarginTop, 'w-full': fullWidth }"
    class="flex space-x-4 overflow-y-auto scrollbar-hide sm:justify-center"
  >
    <CMSBannerLink v-for="link in links" :key="link._uid" :blok="link" />
  </div>
</template>

<script setup lang="ts">
import type { CMSScrollableLinkProps } from '~/modules/cms/providers/storyblok/types'
import CMSBannerLink from '~/modules/cms/providers/storyblok/components/BannerLink.vue'
withDefaults(defineProps<CMSScrollableLinkProps>(), {
  hasMarginTop: false,
  fullWidth: false,
})
defineOptions({ name: 'CMSScrollableLinkList' })
</script>
