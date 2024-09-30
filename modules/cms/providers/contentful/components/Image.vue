<template>
  <Intersect v-if="blok" @enter="onIntersect">
    <NuxtPicture
      v-if="imageSource.src"
      provider="contentful"
      class="picture h-full bg-gray-200"
      :class="isCover ? 'picture-cover' : 'picture-contain'"
      :sizes="sizes"
      :src="imageSource.src"
      loading="lazy"
      :alt="imageSource.alt"
    />
  </Intersect>
</template>

<script setup lang="ts">
import { computed, defineOptions } from 'vue'
import {
  getTeaserImage,
  useContentfulImageSanitizer,
} from '../composables/useContentfulImage'
import { useStorefrontTracking } from '../../../composables/storefront/useStorefrontTracking'
import type {
  CMSImageProps,
  TypePageWithoutUnresolvableLinksResponse,
} from '../types'
import { NuxtPicture } from '#components'
// TODO: This needs to be decoupled from the CMS module as it is coming from the SFB local components
import Intersect from '~/components/Intersect.vue'

const props = withDefaults(defineProps<CMSImageProps>(), {
  _uid: '',
  preload: false,
  isTeaser: false,
  isCover: false,
  sizes: 'xs:100vw sm:100vw md:100vw lg:100vw xl:100vw xxl:100vw 2xl:100vw',
})

const tracking = useStorefrontTracking()
const { sanitize } = useContentfulImageSanitizer()

const imageSource = computed(() =>
  props.isTeaser
    ? getTeaserImage(props.blok as TypePageWithoutUnresolvableLinksResponse)
    : sanitize(props.blok),
)

const onIntersect = (_: IntersectionObserverEntry, stop: () => void) => {
  if (!props.blok?.fields.tracking?.fields.promotion_id) {
    return
  }

  if (tracking) {
    tracking.trackPromotion('view_promotion', props.blok.fields.tracking.fields)
  }

  stop()
}

defineOptions({ name: 'CMSImage' })
</script>
