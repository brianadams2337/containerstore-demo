<template>
  <div class="flex items-start" data-testid="product-gallery">
    <ClientOnly>
      <SFItemsSlider
        with-arrows
        mode="vertical"
        class="mr-4 w-24 shrink-0 max-md:hidden"
        data-testid="product-thumbnails"
        :style="{ height: `${mainImageHeight}px` }"
      >
        <div
          v-for="(productThumbnail, index) in product.images"
          :key="productThumbnail.hash"
          :data-testid="`product-thumbnail-${index}`"
          class="my-2 aspect-3/4 w-24 shrink-0 cursor-pointer overflow-hidden rounded-md bg-gray-50 first:mt-0 last:mb-0"
          :class="[index === activeSlide ? 'bg-gray-900/10' : 'bg-gray-50']"
          @mouseenter="scrollImageIntoView(index)"
          @click="isZoomModalOpen = true"
        >
          <ProductImage
            :image="productThumbnail"
            :alt="alt"
            sizes="xs:96px sm:96px md:96px lg:96px xl:96px"
          />
        </div>
        <template #prev-button="{ prev, isPrevEnabled }">
          <button
            class="absolute left-1/2 top-2 size-8 -translate-x-1/2 rounded-md bg-white/85 p-1 text-gray-400 hover:text-gray-900 disabled:hidden"
            :disabled="!isPrevEnabled"
            @click="prev()"
          >
            <IconChevronUp class="size-6 p-0.5" />
          </button>
        </template>
        <template #next-button="{ next, isNextEnabled }">
          <button
            class="absolute bottom-2 left-1/2 size-8 -translate-x-1/2 rounded-md bg-white/85 p-1 text-gray-400 hover:text-gray-900 disabled:hidden"
            :disabled="!isNextEnabled"
            @click="next()"
          >
            <IconChevronDown class="size-6 p-0.5" />
          </button>
        </template>
      </SFItemsSlider>
      <template #fallback>
        <div class="mr-4 w-24 shrink-0 max-md:hidden" />
      </template>
    </ClientOnly>
    <div class="relative">
      <SFItemsSlider
        id="image"
        ref="image"
        :with-arrows="product.images.length > 1"
        :slider-class="productImageSliderClass"
        data-testid="main-product-image"
        @update:active-slide="updateActiveSlide"
      >
        <ProductImage
          v-for="(productImage, index) in product.images"
          :key="productImage.hash"
          :image="productImage"
          :image-loading="index === 0 ? 'eager' : 'lazy'"
          :preload="index === 0"
          :alt="alt"
          :data-testid="`product-image-${index}`"
          sizes="xs:100vw sm:100vw md:50vw lg:50vw xl:50vw"
          class="min-w-full cursor-pointer snap-start snap-always self-start overflow-hidden md:rounded-md"
          @click="isZoomModalOpen = true"
        />
        <template #arrows="{ prev, isPrevEnabled, next, isNextEnabled }">
          <div class="absolute bottom-4 right-4 flex space-x-px max-md:hidden">
            <button
              class="rounded-l-full bg-white p-2.5 text-gray-400 shadow-secondary transition-transform duration-300 hover:bg-white hover:text-gray-900 disabled:hover:text-gray-400"
              :disabled="!isPrevEnabled"
              @click="prev()"
            >
              <IconChevronLeft class="size-4" />
            </button>
            <button
              class="rounded-r-full bg-white p-2 text-gray-400 shadow-secondary transition-transform duration-300 hover:bg-white hover:text-gray-900 disabled:hover:text-gray-400"
              :disabled="!isNextEnabled"
              @click="next()"
            >
              <IconChevronRight class="size-4" />
            </button>
          </div>
        </template>
        <template #thumbnails>
          <div
            class="absolute bottom-4 left-1/2 flex -translate-x-1/2 space-x-1 md:hidden"
          >
            <div
              v-for="i in product.images.length"
              :key="i"
              class="size-1 rounded-full bg-gray-300 transition-all duration-300"
              :class="{ 'w-3 !bg-black': i - 1 === activeSlide }"
            ></div>
          </div>
        </template>
      </SFItemsSlider>
      <WishlistToggle class="absolute right-5 top-5" :product="product" />
      <ProductBadges
        :product="product"
        class="absolute left-5 max-md:bottom-5 md:top-5"
      />
      <GoBackLink class="left-5 top-5 md:hidden" use-window-history />
    </div>
    <ProductGalleryZoom
      v-model:visible="isZoomModalOpen"
      :alt="alt"
      :images="product.images"
      :start-index="activeSlide"
      @close="isZoomModalOpen = false"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useElementSize } from '@vueuse/core'
import type { Product } from '@scayle/storefront-nuxt'
import { SFItemsSlider } from '#components'
import GoBackLink from '~/modules/ui/runtime/components/links/GoBackLink.vue'
import { useProductBaseInfo } from '#imports'

const props = defineProps<{
  product: Product
  productImageSliderClass?: string
}>()

const image = ref()

const scrollImageIntoView = (index: number) => {
  image.value?.scrollImageIntoView(index, 'smooth')
  activeSlide.value = index
}

const { height: mainImageHeight } = useElementSize(image)
const activeSlide = ref(0)
const updateActiveSlide = (newSlide: number) => {
  activeSlide.value = Number.isFinite(newSlide) ? newSlide : 0
}

const isZoomModalOpen = ref(false)

const { alt } = useProductBaseInfo(props.product)
</script>
