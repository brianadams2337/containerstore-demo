<template>
  <div
    v-if="blok.cta_url?.cached_url"
    v-editable="blok"
    class="border border-white px-7 py-3.5 text-sm leading-normal text-white">
    <DefaultLink
      :key="blok._uid"
      raw
      :to="blok.cta_url?.cached_url"
      @click="clickObserver(blok)">
      {{ blok.label }}
    </DefaultLink>
  </div>
</template>

<script setup lang="ts">
import type { SbBannerLink } from '~/storyblok/types/storyblok'

defineProps({
  blok: {
    type: Object as PropType<SbBannerLink>,
    required: true,
  },
})

const { trackPromotion } = useTrackingEvents()

const clickObserver = (link: SbBannerLink) => {
  return link.promotion_id && trackPromotion('select_promotion', link)
}
</script>
