<template>
  <article v-editable="blok" class="box-border w-4/5 shrink-0 sm:w-1/4">
    <Intersect @enter="onIntersect">
      <NuxtImg
        v-if="isInViewport"
        :src="blok.image.filename"
        sizes="xs:80vw sm:25vw md:25vw lg:25vw xl:25vw xxl:25vw 2xl:25vw"
        provider="storyblok"
        class="aspect-[3/4] w-full"
      />
    </Intersect>
    <div class="mt-4 flex flex-col">
      <div
        class="pb-1 text-2xs font-bold leading-4 sm:pb-0 sm:text-xs sm:leading-6"
      >
        {{ blok.topline || '&nbsp;' }}
      </div>
      <SFHeadline
        :size="headlineSize"
        :badge="blok.is_new ? 'NEW' : undefined"
        is-uppercase
        tag="p"
      >
        {{ blok.headline }}
      </SFHeadline>
      <SFLink
        v-if="blok.cta_url.cached_url"
        class="mt-5 text-base font-bold underline"
        :to="blok.cta_url.cached_url"
        @click="clickObserver"
      >
        {{ blok.cta_label }}
      </SFLink>
    </div>
  </article>
</template>

<script setup lang="ts">
import { computed, defineOptions, ref } from 'vue'
import { useStorefrontTracking } from '../../../composables/storefront/useStorefrontTracking'
import { useStorefrontBreakpoints } from '../../../composables/storefront/useStorefrontBreakpoints'
import type { CMSImageSliderSlideProps } from '../types'

const props = defineProps<CMSImageSliderSlideProps>()

const storefrontBreakpoints = useStorefrontBreakpoints()
const tracking = useStorefrontTracking()

const isInViewport = ref(true)

const onIntersect = (_: IntersectionObserverEntry, stop: () => void) => {
  if (!props.blok.promotion_id) {
    return
  }

  if (tracking) {
    tracking.trackPromotion('view_promotion', props.blok)
  }

  stop()
}

const clickObserver = () => {
  if (props.blok?.promotion_id && tracking) {
    tracking.trackPromotion('select_promotion', props.blok)
  }
}
const headlineSize = computed(() =>
  storefrontBreakpoints && storefrontBreakpoints.isSmaller('md') ? 'xl' : '2xl',
)
defineOptions({ name: 'CMSImageSliderSlide' })
</script>
