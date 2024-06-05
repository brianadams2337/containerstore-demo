<template>
  <div v-if="blok" :class="marginClasses">
    <SFHeadline v-if="blok.fields.h1 ?? ''" tag="h1" is-uppercase>
      {{ blok.fields.h1 }}
    </SFHeadline>
    <Swiper
      v-if="blok?.fields.slides?.length ?? 0"
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
        v-for="(slide, index) in blok.fields.slides"
        :key="`cms-slide-${slide?.sys.id}`"
      >
        <CMSSlide v-if="slide" :blok="slide" :preload="index === 0" />
      </SwiperSlide>
    </Swiper>
  </div>
</template>

<script setup lang="ts">
import { defineOptions , ref } from 'vue'
import { useContentfulMargins } from '../composables/useContentfulMargins'
import type { CMSSlideShowProps } from '../types'
import CMSSlide from '~/modules/cms/providers/contentful/components/Slide.vue'
const props = defineProps<CMSSlideShowProps>()

const sliderRef = ref()

const isDark = ref(true)

const { marginClasses } = useContentfulMargins(props.blok?.fields.marginTop)

defineOptions({ name: 'CMSSlideShow' })
</script>
