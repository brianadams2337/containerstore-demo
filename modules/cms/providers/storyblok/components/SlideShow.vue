<template>
  <div v-editable="blok" :class="marginClasses">
    <Headline v-if="blok.h1" tag="h1" is-uppercase>{{ blok.h1 }}</Headline>
    <Swiper
      v-if="blok.slides?.length"
      ref="sliderRef"
      class
      loop
      navigation
      :modules="[SwiperAutoplay, SwiperNavigation, SwiperPagination]"
      :autoplay="{ delay: 8000, disableOnInteraction: false }"
      :pagination="{ clickable: true }"
      :wrapper-class="isDark ? 'dark-mode' : ''"
    >
      <SwiperSlide
        v-for="(slide, index) in blok.slides"
        :key="`cms-slide-${slide._uid}`"
      >
        <CMSSlide :blok="slide" :preload="index === 0" />
      </SwiperSlide>
    </Swiper>
  </div>
</template>

<script setup lang="ts">
import type { CMSSlideShowProps } from '~/modules/cms/providers/storyblok/types'
import { useStoryblokMargins } from '~/modules/cms/providers/storyblok/composables/useStoryblokMargins'
import CMSSlide from '~/modules/cms/providers/storyblok/components/Slide.vue'
const props = defineProps<CMSSlideShowProps>()

const sliderRef = ref()

const isDark = ref(true)

const { marginClasses } = useStoryblokMargins(props.blok)

defineOptions({ name: 'CMSSlideShow' })
</script>
