<template>
  <div
    v-if="blok.cta_url?.cached_url"
    v-editable="blok"
    class="border border-white px-7 py-3.5 text-sm leading-normal text-white"
  >
    <StoryblokLink
      :key="blok._uid"
      :to="blok.cta_url?.cached_url"
      @click="clickObserver(blok)"
    >
      {{ blok.label }}
    </StoryblokLink>
  </div>
</template>

<script setup lang="ts">
import type { SbBannerLink } from '../types/storyblok'

defineProps<{ blok: SbBannerLink }>()

const { trackPromotion } = useTrackingEvents()

const clickObserver = (link: SbBannerLink) => {
  return link.promotion_id && trackPromotion('select_promotion', link)
}
</script>
