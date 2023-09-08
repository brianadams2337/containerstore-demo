<template>
  <div class="relative">
    <Swiper
      v-if="slides?.length"
      ref="swiperRef"
      v-bind="{ loop, slidesPerView, navigation, autoplay }"
      :modules="[SwiperAutoplay, SwiperNavigation, SwiperPagination]"
      :pagination="{ clickable: true }">
      <SwiperSlide v-for="slide in slides" :key="`demo-slide-${slide}`">
        <NuxtImg :src="slide" provider="default" />
      </SwiperSlide>
    </Swiper>
  </div>
</template>

<script lang="ts" setup>
type AutoplayOptions =
  | boolean
  | { delay: number; disableOnInteraction: boolean }

defineProps({
  slides: {
    type: Array<any>,
    default: () => [],
  },
  autoplay: {
    type: Object as PropType<AutoplayOptions>,
    default: () => ({}),
  },
  loop: {
    type: Boolean,
    default: false,
  },
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
