<template>
  <div class="relative flex flex-col">
    <SFHorizontalItemsSlider
      class="aspect-[5/6] snap-x snap-mandatory rounded-md bg-gray-200"
      with-arrows
    >
      <Intersect
        v-for="(item, imageIndex) in images"
        :key="item.hash"
        :threshold="[0.5]"
        class="relative min-w-full snap-start snap-always"
        @enter="setActiveIndex(imageIndex)"
      >
        <ProductImage
          :image="item"
          sizes="xs:100vw sm:100vw md:100vw"
          height="311"
          fit="cover"
          image-loading="eager"
          class="absolute inset-0"
        />
      </Intersect>
    </SFHorizontalItemsSlider>
    <div class="mt-2 flex justify-center">
      <div
        v-for="(image, imageIndex) in images"
        :key="image.hash"
        class="mr-2 h-[99px] cursor-pointer rounded-md bg-gray-200 last-of-type:mr-0"
        @click="handleThumbnailClick(imageIndex)"
      >
        <ProductImage
          :image="image"
          sizes="xs:100vw sm:100vw md:100vw"
          fit="cover"
          image-loading="eager"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { ProductImage } from '@scayle/storefront-nuxt'

defineProps<{ images: ProductImage[] }>()

const currentIndex = ref(0)
const setActiveIndex = (index: number) => {
  currentIndex.value = index
}

const { scrollImageIntoView } = useHorizontalItemsSlider()

const handleThumbnailClick = (index: number) => {
  setActiveIndex(index)
  scrollImageIntoView(currentIndex.value)
}
</script>
