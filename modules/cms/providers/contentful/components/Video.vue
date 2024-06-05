<template>
  <div v-if="blok">
    <video
      ref="element"
      class="size-full object-contain object-center"
      :class="[marginClasses[0], containerClasses]"
      :controls="blok?.fields.has_controls"
      :disable-picture-in-picture="!blok.fields.has_controls"
      :autoplay="blok.fields.autoplay"
      :loop="blok.fields.loop"
      :src="blok.fields.video?.fields.file?.url"
      :poster="videoPoster"
      @click="clickObserver"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, defineOptions, ref } from 'vue'
import { useIntersectionObserver } from '@vueuse/core'
import type { CMSVideoProps } from '../types'
import { useContentfulMargins } from '../composables/useContentfulMargins'
import { useDefaultBreakpoints, useTrackingEvents } from '~/composables'
import { useImage } from '#imports'

const props = defineProps<CMSVideoProps>()

const { isSmaller } = useDefaultBreakpoints()

const { marginClasses } = useContentfulMargins(props.blok?.fields.marginTop)
const { trackPromotion } = useTrackingEvents()

const img = useImage()

const containerClasses = computed(() => ({
  container: props.blok?.fields.is_containered,
}))

const videoPoster = computed(() => {
  if (!(props.blok?.fields.preview_desktop_image || props.blok)) {
    return
  }

  const key = isSmaller('md') ? 'preview_mobile_image' : 'preview_desktop_image'

  if (!props.blok.fields[key]?.fields.file?.fileName) {
    return
  }

  return img(
    props.blok.fields[key]!.fields.title ??
      props.blok.fields[key]!.fields.file?.fileName ??
      '',
    {},
    { provider: 'contentful' },
  )
})

const element = ref(null)

const { stop } = useIntersectionObserver(
  element,
  ([{ isIntersecting }]) => {
    if (isIntersecting && props.blok?.fields.tracking?.fields.promotion_id) {
      trackPromotion('view_promotion', props.blok.fields.tracking.fields)
      stop()
    }
  },
  {
    threshold: 0.5,
  },
)

const clickObserver = props.blok?.fields.tracking?.fields.promotion_id
  ? () =>
      trackPromotion(
        'select_promotion',
        props.blok?.fields.tracking?.fields ?? {},
      )
  : () => {}

defineOptions({ name: 'CMSVideo' })
</script>
