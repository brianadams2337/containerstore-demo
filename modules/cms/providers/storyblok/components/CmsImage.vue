<template>
  <Intersect v-if="blok" v-editable="blok" @enter="onIntersect">
    <NuxtPicture
      v-if="imageSource?.src"
      provider="storyblok"
      class="picture picture-contain h-full bg-gray-200"
      :src="imageSource?.src"
      loading="lazy"
    />
  </Intersect>
</template>

<script setup lang="ts">
import type { SbCmsImage } from '../types/storyblok'

type Props = {
  blok: SbCmsImage
  preload?: boolean
  isTeaser?: boolean
  sizes?: string
}

const props = withDefaults(defineProps<Props>(), {
  preload: false,
  isTeaser: false,
  sizes: 'xs:100vw sm:100vw md:100vw lg:100vw xl:100vw xxl:100vw 2xl:100vw',
})

const { trackPromotion } = useTrackingEvents()
const { sanitize } = useStoryblokImageSanitizer()

const imageSource = computed(() =>
  props.isTeaser ? getTeaserImage(props.blok) : sanitize(props.blok),
)

const onIntersect = (_: IntersectionObserverEntry, stop: () => void) => {
  if (!props.blok.promotion_id) {
    return
  }
  trackPromotion('view_promotion', props.blok)
  stop()
}
</script>
