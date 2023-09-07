<template>
  <div
    v-if="md"
    class="grid w-full flex-1 grid-cols-12 gap-1"
    data-test-id="tilled-gallery">
    <div
      v-for="(image, idx) in images"
      :key="image.hash"
      class="flex cursor-pointer items-center justify-center overflow-hidden bg-gray-200"
      :class="{
        'col-span-1': getSpanWith(idx, imagesPerRow) === 1,
        'col-span-2': getSpanWith(idx, imagesPerRow) === 2,
        'col-span-3': getSpanWith(idx, imagesPerRow) === 3,
        'col-span-6 xl:col-span-4': getSpanWith(idx, imagesPerRow) === 4,
        'col-span-5': getSpanWith(idx, imagesPerRow) === 5,
        'col-span-12 xl:col-span-6': getSpanWith(idx, imagesPerRow) === 6,
        'col-span-7': getSpanWith(idx, imagesPerRow) === 7,
        'col-span-8': getSpanWith(idx, imagesPerRow) === 8,
        'col-span-9': getSpanWith(idx, imagesPerRow) === 9,
        'col-span-10': getSpanWith(idx, imagesPerRow) === 10,
        'col-span-11': getSpanWith(idx, imagesPerRow) === 11,
        'col-span-12': getSpanWith(idx, imagesPerRow) === 12,
      }"
      @click="emit('click:image', idx)">
      <ProductImage
        :image="image"
        sizes="xs:100vw sm:100vw md:100vw"
        fit="cover"
        :image-loading="idx === 0 ? 'eager' : 'lazy'" />
    </div>
  </div>
  <div v-else class="relative w-full md:w-1/2 xl:w-2/3">
    <HorizontalItemsSlider
      class="-mx-4 aspect-[5/6] snap-x snap-mandatory border-b">
      <!-- TODO Handle intersect -->
      <!-- <intersect
      v-for="(item, idx) in images"
      :key="item.hash"
      :threshold="[0.5]"
      @enter="setActiveSlide(idx)"> -->
      <div
        v-for="(item, idx) in images"
        :key="item.hash"
        class="relative min-w-full snap-start snap-always"
        @click="emit('click:image', idx)">
        <ProductImage
          :image="item"
          sizes="xs:100vw sm:100vw md:100vw"
          fit="cover"
          class="absolute inset-0"
          :image-loading="idx === 0 ? 'eager' : 'lazy'" />
      </div>
      <!-- </intersect> -->
    </HorizontalItemsSlider>
    <FadeInTransition>
      <div class="absolute bottom-4 flex w-full justify-center space-x-2">
        <div
          v-for="(item, slideIdx) in images"
          :key="item.hash"
          class="h-1 w-1 rounded-full"
          :class="{
            'bg-primary': activeSlide === slideIdx,
            'bg-secondary': activeSlide !== slideIdx,
          }">
          &nbsp;
        </div>
      </div>
    </FadeInTransition>
  </div>
</template>

<script setup lang="ts">
import { ProductImage as BapiProductImage } from '@scayle/storefront-nuxt'
import useViewportBreakpoints from '~/composables/useViewportBreakpoints'
defineProps({
  images: {
    type: Array as PropType<BapiProductImage[]>,
    default: () => [],
  },
  imagesPerRow: {
    type: Array as PropType<number[]>,
    default: () => [2, 2, 2, 3, 3],
  },
})

const emit = defineEmits<{
  (e: 'click:image', value: number): void
}>()

const { md } = useViewportBreakpoints()

const activeSlide = ref(0)
const setActiveSlide = (slide: number) => {
  activeSlide.value = slide
}

const getSpanWith = (index: number, imagesPerRow: number[]) => {
  const tiles = imagesPerRow.map((perRow) => Array(perRow).fill(12 / perRow))
  return tiles.flat()[index]
}
</script>
