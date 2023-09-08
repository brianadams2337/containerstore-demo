<template>
  <div v-if="blok && imageSource.src" v-editable="blok" :class="marginClasses">
    <DefaultLink
      v-if="blok.cta_url.linktype === 'story' && blok.cta_url.cached_url"
      raw
      :to="blok.cta_url.cached_url">
      <NuxtImg
        ref="element"
        provider="storyblok"
        class="h-full w-full object-cover"
        :src="imageSource.src"
        :alt="imageSource.alt"
        loading="lazy"
        :sizes="sizes" />
    </DefaultLink>

    <a
      v-else-if="blok.cta_url.linktype === 'url'"
      :href="blok.cta_url.cached_url"
      target="_blank">
      <NuxtImg
        ref="element"
        provider="storyblok"
        class="h-full w-full object-cover"
        :src="imageSource.src"
        :alt="imageSource.alt"
        loading="lazy"
        :sizes="sizes" />
    </a>
  </div>
</template>

<script setup lang="ts">
import { useStoryblokImageSanitizer } from '../composables/useStoryblokImage'
import useStoryblokMargins from '../composables/useStoryblokMargins'
import { SbClickableImage } from '~/storyblok/types/storyblok'

const props = defineProps({
  blok: {
    type: Object as PropType<SbClickableImage>,
    required: true,
  },
  sizes: {
    type: String,
    default: 'xs:100vw sm:100vw md:100vw lg:100vw xl:100vw xxl:100vw 2xl:100vw',
  },
})

const { marginClasses } = useStoryblokMargins(props.blok)
// const { trackPromotion } = useTrackingEvents()
const image = computed(() => props.blok?.image[0])
const { sanitize } = useStoryblokImageSanitizer()
const imageSource = computed(() => sanitize(image.value))

const element = ref(null)

const { stop } = useIntersectionObserver(
  element,
  ([{ isIntersecting }]) => {
    if (isIntersecting && props.blok.promotion_id) {
      //   trackPromotion('view_promotion', image.value)
      stop()
    }
  },
  {
    threshold: 0.5,
  },
)

// const clickObserver = image.value.promotion_id
//   ? () => {
//       //   trackPromotion('select_promotion', image.value)
//     }
//   : () => {}
</script>
