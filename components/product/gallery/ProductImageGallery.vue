<template>
  <div
    class="hidden w-full flex-1 grid-cols-12 gap-1 md:grid"
    data-test-id="tilled-gallery"
  >
    <div
      v-for="(image, index) in images"
      :key="image.hash"
      class="relative flex cursor-pointer items-center justify-center overflow-hidden bg-gray-200"
      :class="{
        'col-span-1': getSpanWith(index, imagesPerRow) === 1,
        'col-span-2': getSpanWith(index, imagesPerRow) === 2,
        'col-span-3': getSpanWith(index, imagesPerRow) === 3,
        'col-span-6 xl:col-span-4': getSpanWith(index, imagesPerRow) === 4,
        'col-span-5': getSpanWith(index, imagesPerRow) === 5,
        'col-span-12 xl:col-span-6': getSpanWith(index, imagesPerRow) === 6,
        'col-span-7': getSpanWith(index, imagesPerRow) === 7,
        'col-span-8': getSpanWith(index, imagesPerRow) === 8,
        'col-span-9': getSpanWith(index, imagesPerRow) === 9,
        'col-span-10': getSpanWith(index, imagesPerRow) === 10,
        'col-span-11': getSpanWith(index, imagesPerRow) === 11,
        'col-span-12': getSpanWith(index, imagesPerRow) === 12,
      }"
      @click="emit('click:image', index)"
    >
      <ProductImage
        :image="image"
        sizes="xs:100vw sm:100vw md:100vw"
        fit="cover"
        :image-loading="index === 0 ? 'eager' : 'lazy'"
      />
    </div>
  </div>
  <div class="relative block w-full md:hidden md:w-1/2 xl:w-2/3">
    <SFHorizontalItemsSlider
      class="-mx-4 aspect-[5/6] snap-x snap-mandatory border-b"
    >
      <Intersect
        v-for="(item, imageIndex) in images"
        :key="item.hash"
        :threshold="[0.5]"
        class="relative min-w-full snap-start snap-always"
        @enter="setActiveSlide(imageIndex)"
      >
        <div @click="emit('click:image', imageIndex)">
          <ProductImage
            :image="item"
            sizes="xs:100vw sm:100vw md:100vw"
            fit="cover"
            class="absolute inset-0"
            :image-loading="imageIndex === 0 ? 'eager' : 'lazy'"
          />
        </div>
      </Intersect>
    </SFHorizontalItemsSlider>
    <SFFadeInTransition>
      <div class="absolute bottom-4 flex w-full justify-center space-x-2">
        <div
          v-for="(item, slideIndex) in images"
          :key="item.hash"
          class="size-1 rounded-full"
          :class="activeSlide === slideIndex ? 'bg-primary' : 'bg-secondary'"
        >
          &nbsp;
        </div>
      </div>
    </SFFadeInTransition>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import type { Product } from '@scayle/storefront-nuxt'

type Props = {
  product: Product
  imagesPerRow?: number[]
}

const props = withDefaults(defineProps<Props>(), {
  imagesPerRow: () => [2, 2, 2, 3, 3],
})

const emit = defineEmits<{
  (e: 'click:image', value: number): void
}>()

const images = computed(() => props.product.images)

const activeSlide = ref(0)
const setActiveSlide = (slide: number) => {
  activeSlide.value = slide
}

const getSpanWith = (index: number, imagesPerRow: number[]) => {
  const tiles = imagesPerRow.map((perRow) => Array(perRow).fill(12 / perRow))
  return tiles.flat()[index]
}
</script>
