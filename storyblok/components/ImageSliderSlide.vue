<template>
  <article v-editable="blok" class="box-border w-4/5 shrink-0 sm:w-1/4">
    <Intersect class="aspect-h-4 aspect-w-3" @enter="onIntersect">
      <NuxtImg
        v-if="isInViewport"
        :src="blok.image.filename"
        sizes="xs:80vw sm:25vw md:25vw lg:25vw xl:25vw xxl:25vw 2xl:25vw"
        provider="storyblok"
        class="w-full" />
    </Intersect>
    <div class="mt-4 flex flex-col">
      <div
        class="pb-1 text-2xs font-bold leading-4 sm:pb-0 sm:text-xs sm:leading-6">
        {{ blok.topline || '&nbsp;' }}
      </div>
      <Headline
        tag="p"
        :size="headlineSize"
        :badge="blok.is_new ? 'NEW' : undefined">
        {{ blok.headline }}
      </Headline>
      <DefaultLink
        v-if="blok.cta_url.cached_url"
        class="mt-5 text-base font-bold underline"
        :to="blok.cta_url.cached_url"
        @click="clickObserver">
        {{ blok.cta_label }}
      </DefaultLink>
    </div>
  </article>
</template>

<script setup lang="ts">
import { SbImageSliderSlide } from '~/storyblok/types/storyblok'

const props = defineProps({
  blok: {
    type: Object as PropType<SbImageSliderSlide>,
    required: true,
  },
})

// const { trackPromotion } = useTrackingEvents()
const { isLessThan } = useViewport()
const isMobile = computed(() => isLessThan('md'))

const isInViewport = ref(true)

const onIntersect = (_: IntersectionObserverEntry, stop: () => void) => {
  if (!props.blok.promotion_id) {
    return
  }
  //   trackPromotion('view_promotion', props.blok)
  stop()
}

const clickObserver = () => {
  if (props.blok.promotion_id) {
    // trackPromotion('select_promotion', props.blok)
  }
}
const headlineSize = computed(() => (isMobile.value ? 'xl' : '2xl'))
</script>
