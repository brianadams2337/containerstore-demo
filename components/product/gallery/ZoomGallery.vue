<template>
  <Modal full-screen @close="emit('click:close-zoom-gallery')">
    <div class="relative flex h-full w-full flex-col">
      <!-- slides -->
      <div class="relative h-full flex-1 overflow-hidden">
        <button
          class="absolute bottom-3 z-10 ml-10 text-lg sm:bottom-auto sm:top-2/4"
          @click="navigateToImage('prev')">
          <IconArrowLeft class="h-5 w-5" />
        </button>
        <div
          ref="zoomGalleryRef"
          class="flex h-full snap-x snap-mandatory overflow-x-auto scrollbar-hide">
          <div
            v-for="(image, idx) in images"
            :key="image.hash"
            class="max-h-full min-w-full snap-center transition-transform"
            :class="getClasses(idx)"
            :style="style">
            <Intersect :threshold="0.5" @enter="handleIntersect(idx)">
              <ProductImage
                :hash="image.hash"
                :image="image"
                class="m-auto h-full"
                sizes="xs:100vw sm:100vw md:100vw"
                @mousemove="updateZoomYOffset"
                @click="toggleDoubleZoom" />
            </Intersect>
          </div>
        </div>
        <button
          class="absolute bottom-3 right-0 z-10 mr-10 text-lg sm:bottom-auto sm:top-2/4"
          @click="navigateToImage('next')">
          <IconArrowRight class="h-5 w-5" />
        </button>
      </div>

      <div
        class="absolute bottom-0 left-2/4 w-full -translate-x-2/4 sm:bottom-6 sm:w-auto">
        <ThumbnailSlider
          :images="images"
          :active-index="currentIndex"
          @click:thumbnail="handleThumbnailClick($event)" />
      </div>
    </div>
  </Modal>
</template>

<script setup lang="ts">
import type { ProductImage } from '@scayle/storefront-nuxt'

const props = defineProps({
  images: {
    type: Array as PropType<ProductImage[]>,
    required: true,
  },
  activeIndex: {
    type: Number,
    default: 0,
  },
})

const emit = defineEmits<{
  (e: 'click:close-zoom-gallery'): void
}>()

const currentIndex = ref(0)

const {
  wrapAroundIndex,
  scrollImageIntoView,
  containerRef: zoomGalleryRef,
  doubleZoomActive,
  doubleZoomOffsetY,
  updateZoomYOffset,
  toggleDoubleZoom,
} = useZoomGallery(props.images.length)

const getClasses = (idx: number) => ({
  'scale-125 cursor-zoom-out sm:scale-150':
    doubleZoomActive.value && idx === currentIndex.value,
  'cursor-zoom-in': !doubleZoomActive.value,
})

const style = computed(() => {
  return doubleZoomActive.value
    ? `transform-origin: 50% ${doubleZoomOffsetY.value}px`
    : ''
})

watch(
  () => zoomGalleryRef.value,
  () => {
    currentIndex.value = props.activeIndex
    scrollImageIntoView(currentIndex.value)
  },
)

const navigateToImage = (direction: 'next' | 'prev') => {
  currentIndex.value = wrapAroundIndex(
    currentIndex.value + (direction === 'next' ? 1 : -1),
  )
  doubleZoomActive.value = false
  scrollImageIntoView(currentIndex.value, 'smooth')
}

const handleThumbnailClick = (idx: number) => {
  currentIndex.value = idx
  scrollImageIntoView(currentIndex.value)
}

const handleIntersect = (idx: number) => {
  currentIndex.value = idx
  doubleZoomActive.value = false
}
</script>
