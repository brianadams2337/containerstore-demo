<template>
  <div
    :class="{ 'mt-4': hasMarginTop, 'w-full': fullWidth }"
    class="flex space-x-4 overflow-y-auto scrollbar-hide sm:justify-center"
  >
    <CMSBannerLink
      v-for="link in links"
      :key="link.blok?.fields.uid"
      :blok="link.blok"
    />
  </div>
</template>

<script setup lang="ts">
import type { CMSScrollableLinkProps } from '~/modules/cms/providers/contentful/types'

withDefaults(defineProps<CMSScrollableLinkProps>(), {
  hasMarginTop: false,
  fullWidth: false,
})
defineOptions({ name: 'CMSScrollableLinkList' })
</script>
