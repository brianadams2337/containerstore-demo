<template>
  <article
    :id="id"
    v-element-visibility="onVisible"
    data-testid="article"
    class="group/product-card relative flex h-full flex-col"
    @mouseover="onMouseOver"
    @mouseleave="onMouseLeave"
  >
    <div
      class="group relative flex aspect-3/4 max-h-md items-center justify-center overflow-hidden rounded-lg bg-white-smoke"
      :class="
        edgeBorderless &&
        (isRightSideBorderless
          ? 'max-md:rounded-r-none'
          : 'max-md:rounded-l-none')
      "
    >
      <div
        class="absolute left-auto right-1 top-2 z-20 flex h-8 w-auto cursor-pointer p-1 transition md:right-0 md:top-0 md:h-12 md:p-3"
      >
        <WishlistToggle
          :product="product"
          :listing-meta-data="listingMetaData"
        />
      </div>
      <ProductCardBadgesHeader
        v-if="!hideBadges"
        :product="product"
        class="absolute left-3 top-3 w-full"
      />
      <template v-if="link && image">
        <ProductCardImage
          v-if="shouldShowSingleImage"
          :image="image"
          :alt="alt"
          :link="link"
          :product-index="index"
          @click.capture="$emit('click:product')"
        />

        <ProductCardImageSlider
          v-else
          :alt="alt"
          :link="link"
          :is-product-hovered="isProductHovered"
          :product-index="index"
          :images="images"
          @click.capture="$emit('click:product')"
        />
      </template>
      <ProductCardBadgesFooter
        :product="product"
        class="absolute bottom-0 left-0 w-full"
      />
    </div>
    <ProductCardDetails
      v-if="link"
      :product="product"
      :link="link"
      @click.capture="$emit('click:product')"
    />
  </article>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import type { Product } from '@scayle/storefront-nuxt'
import { vElementVisibility } from '@vueuse/components'
import WishlistToggle from '../WishlistToggle.vue'
import ProductCardImage from './ProductCardImage.vue'
import ProductCardImageSlider from './imageSlider/ProductCardImageSlider.vue'
import ProductCardBadgesFooter from './badges/ProductCardBadgesFooter.vue'
import ProductCardBadgesHeader from './badges/ProductCardBadgesHeader.vue'
import ProductCardDetails from './ProductCardDetails.vue'
import { useProductBaseInfo } from '~/composables'
import type { ListItem } from '~/types/tracking'

type Props = {
  product: Product
  index?: number
  isRightSideBorderless?: boolean
  edgeBorderless?: boolean
  multipleImages?: boolean
  listingMetaData?: ListItem
  hideBadges?: boolean
}

const {
  product,
  listingMetaData,
  index = -1,
  multipleImages = false,
  isRightSideBorderless = false,
  edgeBorderless = false,
  hideBadges = false,
} = defineProps<Props>()

const hasBeenVisible = ref(false)

const onVisible = (state: boolean) => {
  if (!state) {
    return
  }
  emit('intersect:product', product.id)
  hasBeenVisible.value = true
}
const isProductHovered = ref(false)

const onMouseOver = () => {
  isProductHovered.value = true
  emit('product-image:mouseover')
}

const onMouseLeave = () => {
  isProductHovered.value = false
  emit('product-image:mouseleave')
}

const { alt, image, images, link } = useProductBaseInfo(product)

const shouldShowSingleImage = computed(() => {
  return !multipleImages || images.value.length === 1 || !hasBeenVisible.value
})

const id = computed(() => `product-${product.id}`)

const emit = defineEmits<{
  'intersect:product': [number]
  'product-image:mouseover': []
  'product-image:mouseleave': []
  'click:product': []
}>()
</script>
