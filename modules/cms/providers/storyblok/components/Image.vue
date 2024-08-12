<template>
  <Intersect v-if="blok" v-editable="blok" @enter="onIntersect">
    <NuxtPicture
      v-if="imageSource?.src"
      provider="storyblok"
      class="picture h-full bg-gray-200"
      :class="isCover ? 'picture-cover' : 'picture-contain'"
      :src="imageSource?.src"
      loading="lazy"
    />
  </Intersect>
</template>

<script setup lang="ts">
import { computed, defineOptions } from 'vue'
import { useStorefrontTracking } from '../../../composables/storefront/useStorefrontTracking'
import type { CMSImageProps } from '../types'
import {
  getTeaserImage,
  useStoryblokImageSanitizer,
} from '../composables/useStoryblokImage'

const props = withDefaults(defineProps<CMSImageProps>(), {
  preload: false,
  isTeaser: false,
  isCover: false,
  sizes: 'xs:100vw sm:100vw md:100vw lg:100vw xl:100vw xxl:100vw 2xl:100vw',
})

const tracking = useStorefrontTracking()
const { sanitize } = useStoryblokImageSanitizer()

const imageSource = computed(() =>
  props.isTeaser ? getTeaserImage(props.blok) : sanitize(props.blok),
)

const onIntersect = (_: IntersectionObserverEntry, stop: () => void) => {
  if (!props.blok.promotion_id) {
    return
  }

  if (tracking) {
    tracking.trackPromotion('view_promotion', props.blok)
  }

  stop()
}

defineOptions({ name: 'CMSImage' })
</script>
