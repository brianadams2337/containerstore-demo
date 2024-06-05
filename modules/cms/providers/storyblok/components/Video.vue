<template>
  <div>
    <video
      ref="element"
      class="size-full object-contain object-center"
      :class="[marginClasses[0], containerClasses]"
      :controls="blok.has_controls"
      :disable-picture-in-picture="!blok.has_controls"
      :autoplay="blok.autoplay"
      :loop="blok.loop"
      :src="blok.video.filename"
      :poster="videoPoster"
      @click="clickObserver"
    />
  </div>
</template>

<script setup lang="ts">
import { defineOptions , ref , computed } from 'vue'
import { useIntersectionObserver } from '@vueuse/core'
import { useTrackingEvents } from '~/composables/useTrackingEvents'
import { useDefaultBreakpoints } from '~/composables/useDefaultBreakpoints'
import type { CMSVideoProps } from '../types'
import { useStoryblokMargins } from '../composables/useStoryblokMargins'

const props = defineProps<CMSVideoProps>()

const { isSmaller } = useDefaultBreakpoints()

const { marginClasses } = useStoryblokMargins(props.blok)
const { trackPromotion } = useTrackingEvents()

const img = useImage()

const containerClasses = computed(() => ({
  container: props.blok.is_containered,
}))

const videoPoster = computed(() => {
  if (!(props.blok.preview_desktop_image || props.blok.preview_mobile_image)) {
    return
  }

  const key = isSmaller('md') ? 'preview_mobile_image' : 'preview_desktop_image'

  if (!props.blok[key]?.filename) {
    return
  }

  return img(props.blok[key]!.filename, {}, { provider: 'storyblok' })
})

const element = ref(null)

const { stop } = useIntersectionObserver(
  element,
  ([{ isIntersecting }]) => {
    if (isIntersecting && props.blok.promotion_id) {
      trackPromotion('view_promotion', props.blok)
      stop()
    }
  },
  {
    threshold: 0.5,
  },
)

const clickObserver = props.blok.promotion_id
  ? () => trackPromotion('select_promotion', props.blok)
  : () => {}

defineOptions({ name: 'CMSVideo' })
</script>
