<template>
  <div class="relative">
    <Swiper
      v-if="slides?.length"
      ref="swiperRef"
      :modules="[SwiperAutoplay, SwiperNavigation, SwiperPagination]"
      :slides-per-view="slidesPerView"
      :loop="loop"
      :pagination="{ clickable: true }"
      :navigation="navigation"
      :autoplay="autoplay">
      <SwiperSlide v-for="slide in slides" :key="`demo-slide-${slide}`">
        <nuxt-img :src="slide" provider="default" />
      </SwiperSlide>
    </Swiper>
  </div>
</template>

<script lang="ts" setup>
type AutoplayOptions =
  | boolean
  | { delay: number; disableOnInteraction: boolean }

defineProps({
  slides: { type: Array<any>, default: () => [] },
  autoplay: {
    type: Object as PropType<AutoplayOptions>,
    default: () => ({}),
  },
  loop: { type: Boolean, default: false },
  slidesPerView: {
    type: Number,
    default: 1,
  },
  navigation: {
    type: Boolean,
    default: false,
  },
})

const swiperRef = ref()
</script>

<script lang="ts">
export default {
  name: 'AppSlideshow',
}
</script>

<style lang="css" scoped>
:deep(.swiper-button-next::after) {
  --swiper-navigation-size: 1.5rem;
  color: black;
}
:deep(.swiper-button-prev::after) {
  --swiper-navigation-size: 1.5rem;
  color: black;
}
</style>
