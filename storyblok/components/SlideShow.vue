<template>
  <div>
    <Headline v-if="blok.h1" tag="h1">{{ blok.h1 }}</Headline>
    <Swiper
      v-if="blok.slides?.length"
      ref="swiperRef"
      loop
      :modules="[SwiperAutoplay, SwiperNavigation, SwiperPagination]"
      :autoplay="{ delay: 3000 }"
      :pagination="{ clickable: true }">
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

defineProps({
  blok: {
    type: Object as PropType<SlideShowStoryblok>,
    required: true,
  },
})
</script>
