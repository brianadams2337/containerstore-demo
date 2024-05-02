<template>
  <div class="relative">
    <Swiper
      v-if="slides?.length"
      ref="swiperRef"
      v-bind="{ loop, slidesPerView, navigation, autoplay }"
      :modules="[SwiperAutoplay, SwiperNavigation, SwiperPagination]"
      :pagination="{ clickable: true }"
    >
      <SwiperSlide v-for="slide in slides" :key="`demo-slide-${slide}`">
        <NuxtImg :src="slide" provider="default" />
      </SwiperSlide>
    </Swiper>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'

type AutoplayOptions =
  | boolean
  | { delay: number; disableOnInteraction: boolean }

type Props = {
  slides?: string[]
  autoplay?: AutoplayOptions
  loop?: boolean
  slidesPerView?: number
  navigation?: boolean
}

withDefaults(defineProps<Props>(), {
  slides: () => [],
  autoplay: false,
  loop: false,
  slidesPerView: 1,
  navigation: false,
})

const swiperRef = ref()
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
