<template>
  <div
    v-if="blok.cta_url?.cached_url"
    v-editable="blok"
    class="border border-white px-7 py-3.5 text-sm leading-normal text-white">
    <RawLink
      :key="blok._uid"
      :to="blok.cta_url?.cached_url"
      @click="clickObserver(blok)"
      >{{ blok.label }}</RawLink
    >
  </div>
</template>

<script setup lang="ts">
import { BannerStoryblok } from '../types/component-types-sb'

defineProps({
  blok: {
    type: Object as PropType<BannerStoryblok>,
    required: true,
  },
})

//   const { trackPromotion } = useTrackingEvents()
const clickObserver = (link: BannerStoryblok) => {
  if (link.promotion_id) {
    //   trackPromotion('select_promotion', link)
  }
}
</script>
