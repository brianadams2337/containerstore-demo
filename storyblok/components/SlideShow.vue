<template>
  <div v-editable="blok" :class="marginClasses">
    <Headline v-if="blok.h1" tag="h1">{{ blok.h1 }}</Headline>
    <Swiper
      v-if="blok.slides?.length"
      ref="sliderRef"
      class
      loop
      navigation
      :modules="[SwiperAutoplay, SwiperNavigation, SwiperPagination]"
      :autoplay="{ delay: 8000, disableOnInteraction: false }"
      :pagination="{ clickable: true }"
      :wrapper-class="isDark ? 'dark-mode' : ''">
      <SwiperSlide
        v-for="(slide, index) in blok.slides"
        :key="`cms-slide-${slide._uid}`">
        <CmsSlide :blok="slide" :preload="index === 0" />
      </SwiperSlide>
    </Swiper>
  </div>
</template>
<script setup lang="ts">
import { SlideShowStoryblok } from '../types/component-types-sb'
import useStoryblokMargins from '../composables/useStoryblokMargins'

const props = defineProps({
  blok: {
    type: Object as PropType<SlideShowStoryblok>,
    required: true,
  },
})

const sliderRef = ref()

const isDark = ref(true)

const { marginClasses } = useStoryblokMargins(props.blok)
</script>
