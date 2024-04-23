<template>
  <div v-if="blok" :class="marginClasses">
    <DefaultLink
      v-if="blok.fields.ctaUrl"
      :target="isLinkTypeUrl ? '_blank' : '_self'"
      :to="blok.fields.ctaUrl"
      raw
      @click="clickObserver"
    >
      <Intersect :threshold="0.5" @enter="onIntersect">
        <NuxtImg
          v-if="imageSource"
          provider="contentful"
          class="size-full object-cover"
          :src="imageSource.src"
          :alt="imageSource.alt"
          loading="lazy"
          :sizes="sizes"
        />
      </Intersect>
    </DefaultLink>
  </div>
</template>

<script setup lang="ts">
import { isStringURL } from '~/modules/cms/utils/helpers'
import type { CMSClickableImageProps } from '~/modules/cms/providers/contentful/types'
import { useContentfulMargins } from '~/modules/cms/providers/contentful/composables/useContentfulMargins'
import { useContentfulImageSanitizer } from '~/modules/cms/providers/contentful/composables/useContentfulImage'
const props = withDefaults(defineProps<CMSClickableImageProps>(), {
  sizes: 'xs:100vw sm:100vw md:100vw lg:100vw xl:100vw xxl:100vw 2xl:100vw',
})

const { marginClasses } = useContentfulMargins(props.blok?.fields.marginTop)
const tracking = useStorefrontTracking()
const image = computed(() => props.blok?.fields.image.at(0)?.fields)
const { sanitize } = useContentfulImageSanitizer()
const imageSource = computed(() => sanitize(props.blok?.fields.image.at(0)))

/**
 * TODO: check if this is the correct way to handle the link
 * storyblok uses cta_url.cached_url is this the same as ctaUrl?
 */
const isLinkTypeUrl = computed(() =>
  isStringURL(props.blok?.fields.ctaUrl ?? ''),
)

const onIntersect = (_: IntersectionObserverEntry, stop: () => void) => {
  if (!props.blok?.fields.tracking?.fields.promotion_id) {
    return
  }
  tracking &&
    tracking.trackPromotion('view_promotion', props.blok.fields.tracking.fields)
  stop()
}

const clickObserver = image.value?.tracking?.fields.promotion_id
  ? () =>
      tracking &&
      tracking.trackPromotion(
        'select_promotion',
        image.value?.tracking?.fields ?? {},
      )
  : () => {}

defineOptions({ name: 'CMSClickableImage' })
</script>
