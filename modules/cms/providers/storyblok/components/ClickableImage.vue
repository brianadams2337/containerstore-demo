<template>
  <div v-if="blok && imageSource.src" v-editable="blok" :class="marginClasses">
    <CMSStoryblokLink
      v-if="blok.cta_url.cached_url"
      :target="isLinkTypeUrl ? '_blank' : '_self'"
      :to="blok.cta_url.cached_url"
      @click="clickObserver"
    >
      <Intersect :threshold="0.5" @enter="onIntersect">
        <NuxtImg
          provider="storyblok"
          class="size-full object-cover"
          :src="imageSource.src"
          :alt="imageSource.alt"
          loading="lazy"
          :sizes="sizes"
        />
      </Intersect>
    </CMSStoryblokLink>
  </div>
</template>

<script setup lang="ts">
import { computed, defineOptions } from 'vue'
import { useStorefrontTracking } from '../../../composables/storefront/useStorefrontTracking'
import type { CMSClickableImageProps } from '../types'
import { useStoryblokMargins } from '../composables/useStoryblokMargins'
import { useStoryblokImageSanitizer } from '../composables/useStoryblokImage'
import CMSStoryblokLink from './StoryblokLink.vue'

const props = withDefaults(defineProps<CMSClickableImageProps>(), {
  sizes: 'xs:100vw sm:100vw md:100vw lg:100vw xl:100vw xxl:100vw 2xl:100vw',
})

const { marginClasses } = useStoryblokMargins(props.blok)
const tracking = useStorefrontTracking()
const image = computed(() => props.blok?.image[0])
const { sanitize } = useStoryblokImageSanitizer()
const imageSource = computed(() => sanitize(image.value))

const isLinkTypeUrl = computed(() => props.blok.cta_url.linktype === 'url')

const onIntersect = (_: IntersectionObserverEntry, stop: () => void) => {
  if (!props.blok.promotion_id) {
    return
  }

  if (tracking) {
    tracking.trackPromotion('view_promotion', props.blok)
  }

  stop()
}

const clickObserver = image.value.promotion_id
  ? () => tracking && tracking.trackPromotion('select_promotion', image.value)
  : () => {}

defineOptions({ name: 'CMSClickableImage' })
</script>
