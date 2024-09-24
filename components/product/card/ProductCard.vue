<template>
  <Intersect
    :id="id"
    data-testid="article"
    tag="article"
    class="group/product-card relative flex h-full flex-col"
    @mouseover="onMouseOver"
    @mouseleave="onMouseLeave"
    @enter="emit('intersect:product', props.product.id)"
  >
    <div
      class="group relative flex aspect-[3/4] max-h-md items-center justify-center overflow-hidden rounded-lg bg-white-smoke"
      :class="
        edgeBorderless &&
        (isRightSideBorderless
          ? 'max-md:rounded-r-none'
          : 'max-md:rounded-l-none')
      "
    >
      <div
        class="absolute left-auto right-1 top-1 z-20 flex h-12 w-auto cursor-pointer p-1 opacity-100 transition md:right-0 md:top-0 md:p-3"
        :class="{ 'lg:opacity-0': !isProductHovered }"
      >
        <WishlistToggle v-bind="{ product, listingMetaData }" />
      </div>
      <ProductCardBadgesHeader
        :product="product"
        class="absolute left-3 top-3 w-full"
      />
      <template v-if="link && image">
        <ProductCardImage
          v-if="shouldShowSingleImage"
          v-bind="{ image, alt, link }"
          :product-index="index"
          @click.capture="$emit('click:product')"
        />

        <ProductCardImageSlider
          v-else
          v-bind="{ image, alt, link, isProductHovered }"
          :product-index="index"
          :images="product.images"
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
      v-bind="{ product, link }"
      @click.capture="$emit('click:product')"
    />
  </Intersect>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import type { Product } from '@scayle/storefront-nuxt'
import { useProductBaseInfo } from '~/composables'

type Props = {
  product: Product
  index?: number
  isRightSideBorderless?: boolean
  edgeBorderless?: boolean
  multipleImages?: boolean
  listingMetaData?: ListItem
}

const props = withDefaults(defineProps<Props>(), {
  index: -1,
  multipleImages: false,
  listingMetaData: undefined,
  isRightSideBorderless: false,
  edgeBorderless: false,
})

const isProductHovered = ref(false)

const onMouseOver = () => {
  isProductHovered.value = true
  emit('product-image:mouseover')
}

const onMouseLeave = () => {
  isProductHovered.value = false
  emit('product-image:mouseleave')
}

const { alt, image, link } = useProductBaseInfo(props.product)

const shouldShowSingleImage = computed(() => {
  return !props.multipleImages || props.product.images.length === 1
})

const id = computed(() => `product-${props.product.id}`)

const emit = defineEmits<{
  'intersect:product': [number]
  'product-image:mouseover': []
  'product-image:mouseleave': []
  'click:product': []
}>()
</script>
