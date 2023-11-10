<template>
  <div
    v-show="isGreaterOrEquals('md')"
    class="grid w-full flex-1 grid-cols-12 gap-1"
    data-test-id="tilled-gallery"
  >
    <div
      v-for="(image, idx) in images"
      :key="image.hash"
      class="relative flex cursor-pointer items-center justify-center overflow-hidden bg-gray-200"
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
      @click="emit('click:image', idx)"
    >
      <ProductImage
        :image="image"
        sizes="xs:100vw sm:100vw md:100vw"
        fit="cover"
        :image-loading="idx === 0 ? 'eager' : 'lazy'"
      />
      <ProductPromotionBadge
        v-if="promotionLabel && productPromotionId && idx === 0"
        :label="promotionLabel"
        :product-promotion-id="productPromotionId"
        class="absolute bottom-3 left-3"
      />
    </div>
  </div>
  <div
    v-show="!isGreaterOrEquals('md')"
    class="relative w-full md:w-1/2 xl:w-2/3"
  >
    <HorizontalItemsSlider
      class="-mx-4 aspect-[5/6] snap-x snap-mandatory border-b"
    >
      <intersect
        v-for="(item, idx) in images"
        :key="item.hash"
        :threshold="[0.5]"
        class="relative min-w-full snap-start snap-always"
        @enter="setActiveSlide(idx)"
      >
        <div @click="emit('click:image', idx)">
          <ProductImage
            :image="item"
            sizes="xs:100vw sm:100vw md:100vw"
            fit="cover"
            class="absolute inset-0"
            :image-loading="idx === 0 ? 'eager' : 'lazy'"
          />
        </div>
      </intersect>
    </HorizontalItemsSlider>
    <ProductPromotionBadge
      v-if="promotionLabel && productPromotionId"
      :label="promotionLabel"
      :product-promotion-id="productPromotionId"
      class="absolute bottom-3 left-0 top-auto"
    />
    <FadeInTransition>
      <div class="absolute bottom-4 flex w-full justify-center space-x-2">
        <div
          v-for="(item, slideIdx) in images"
          :key="item.hash"
          class="h-1 w-1 rounded-full"
          :class="activeSlide === slideIdx ? 'bg-primary' : 'bg-secondary'"
        >
          &nbsp;
        </div>
      </div>
    </FadeInTransition>
  </div>
</template>

<script setup lang="ts">
import { type Product, getFirstAttributeValue } from '@scayle/storefront-nuxt'

const props = defineProps({
  product: {
    type: Object as PropType<Product>,
    default: () => ({}),
  },
  imagesPerRow: {
    type: Array as PropType<number[]>,
    default: () => [2, 2, 2, 3, 3],
  },
})

const emit = defineEmits<{
  (e: 'click:image', value: number): void
}>()

const { isGreaterOrEquals } = useViewport()

const images = computed(() => props.product.images)

const activeSlide = ref(0)
const setActiveSlide = (slide: number) => {
  activeSlide.value = slide
}

const getSpanWith = (index: number, imagesPerRow: number[]) => {
  const tiles = imagesPerRow.map((perRow) => Array(perRow).fill(12 / perRow))
  return tiles.flat()[index]
}

const promotionLabel = computed(() => {
  return getFirstAttributeValue(props.product.attributes, 'promotion')?.label
})

const productPromotionId = computed(() => {
  return getFirstAttributeValue(props.product.attributes, 'promotion')?.id
})
</script>
