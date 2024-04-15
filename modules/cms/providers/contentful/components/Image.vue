<template>
  <Intersect v-if="blok" @enter="onIntersect">
    <NuxtPicture
      v-if="imageSource"
      provider="contentful"
      class="picture picture-contain h-full bg-gray-200"
      :sizes="sizes"
      :src="imageSource.src"
      loading="lazy"
      :alt="imageSource.alt"
    />
  </Intersect>
</template>

<script setup lang="ts">
import type {
  CMSImageProps,
  TypePageWithoutUnresolvableLinksResponse,
} from '~/modules/cms/providers/contentful/types'
import { useContentfulImageSanitizer } from '~/modules/cms/providers/contentful/composables/useContentfulImage'

const props = withDefaults(defineProps<CMSImageProps>(), {
  _uid: '',
  preload: false,
  isTeaser: false,
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
  tracking &&
    tracking.trackPromotion('view_promotion', props.blok.fields.tracking.fields)
  stop()
}

defineOptions({ name: 'CMSImage' })
</script>
