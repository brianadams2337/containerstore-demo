<template>
  <div v-editable="blok">
    <NuxtImg
      v-if="imageSource?.src"
      ref="element"
      provider="storyblok"
      class="picture picture-contain h-full bg-gray-200"
      :src="imageSource?.src"
      loading="lazy" />
  </div>
</template>

<script setup lang="ts">
import { CmsImageStoryblok } from '../types/component-types-sb'
import {
  getTeaserImage,
  useStoryblokImageSanitizer,
} from '../composables/useStoryblokImage'

const props = defineProps({
  preload: {
    type: Boolean as PropType<boolean>,
    default: false,
  },
  sizes: {
    type: String as PropType<string>,
    default: 'xs:100vw sm:100vw md:100vw lg:100vw xl:100vw xxl:100vw 2xl:100vw',
  },
  isTeaser: {
    type: Boolean as PropType<boolean>,
    default: false,
  },
  blok: {
    type: Object as PropType<CmsImageStoryblok>,
    required: true,
  },
})

// const { trackPromotion } = useTrackingEvents()
// const { md } = useBreakpoints()
const { sanitize } = useStoryblokImageSanitizer()

const imageSource = computed(() =>
  props.isTeaser ? getTeaserImage(props.blok) : sanitize(props.blok),
)

const element = ref(null)

// const { stop } = useIntersectionObserver(
//   element,
//   ([{ isIntersecting }]) => {
//     if (isIntersecting && props.blok.promotion_id) {
//       trackPromotion('view_promotion', props.blok)
//       stop()
//     }
//   },
//   {
//     threshold: 0.5,
//   },
// )
</script>
