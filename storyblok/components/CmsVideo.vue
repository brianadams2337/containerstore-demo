<template>
  <div>
    <video
      ref="element"
      class="h-full w-full object-contain object-center"
      :class="[marginClasses[0], containerClasses]"
      :controls="blok.has_controls"
      :disable-picture-in-picture="!blok.has_controls"
      :autoplay="blok.autoplay"
      :loop="blok.loop"
      :src="blok.video.filename"
      :poster="videoPoster"
      @click="clickObserver" />
  </div>
</template>

<script setup lang="ts">
import useStoryblokMargins from '../composables/useStoryblokMargins'
import { SbVideo } from '../types/storyblok'

const props = defineProps({
  blok: {
    type: Object as PropType<SbVideo>,
    required: true,
  },
})

const { sm } = useBreakpoints()
const { marginClasses } = useStoryblokMargins(props.blok)
const { trackPromotion } = useTrackingEvents()

const img = useImage()

const containerClasses = computed(() => ({
  container: props.blok.is_containered,
}))

const videoPoster = computed(() => {
  if (props.blok.preview_desktop_image || props.blok.preview_mobile_image) {
    const key = sm.value ? 'preview_mobile_image' : 'preview_desktop_image'

    return props.blok[key]?.filename
      ? img(props.blok[key]!.filename, {}, { provider: 'storyblok' })
      : undefined
  }
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
</script>
