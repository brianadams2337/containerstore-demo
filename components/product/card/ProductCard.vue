<template>
  <div
    :data-product-card-id="product.id"
    :class="{ 'animate-pulse': loading }"
    class="group relative">
    <slot>
      <article
        :id="`product-${product.id}`"
        ref="article"
        class="flex h-full flex-col">
        <slot name="header">
          <div
            class="group aspect-h-4 aspect-w-3 relative flex max-h-md items-center justify-center bg-gray-200"
            @mouseover="onMouseOver"
            @mouseleave="onMouseLeave">
            <slot v-if="product" name="header-actions">
              <ProductCardHeaderActions
                v-bind="{ product, wishlistRemoveIcon }"
                :class="headerActionsClass"
                class="opacity-100 transition" />
            </slot>
            <slot name="header-image" :image="image">
              <slot name="button"> </slot>
              <DefaultLink
                :to="link"
                raw
                @click.capture="$emit('click:product')">
                <ProductImage
                  v-if="image"
                  v-bind="{ image, imageLoading }"
                  :alt="name"
                  :class="imageClasses"
                  fit="contain"
                  sizes="sm:100vw"
                  is-centered
                  class="absolute inset-0 transition duration-200" />
                <div
                  v-if="hoverImage && loadHoverImage"
                  class="opacity-0 transition duration-300 group-hover:opacity-100">
                  <FadeInTransition :duration="300">
                    <ProductImage
                      :image="hoverImage"
                      :image-loading="imageLoading"
                      :alt="name"
                      sizes="sm:100vw"
                      fit="cover"
                      class="absolute inset-0" />
                  </FadeInTransition>
                </div>
              </DefaultLink>
            </slot>
            <slot name="header-badge" :label="badgeLabel">
              <DefaultLink
                v-if="badgeLabel"
                :to="link"
                @click.capture="$emit('click:product')">
                <ProductBadge
                  :badge-label="badgeLabel"
                  class="absolute left-0 top-0" />
              </DefaultLink>
            </slot>
          </div>
        </slot>
        <slot name="description" v-bind="$props">
          <div class="my-2 px-2.5 md:my-2.5">
            <DefaultLink
              :to="link"
              class="text-2xs font-medium uppercase leading-tight text-primary opacity-50 md:text-xs"
              @click.capture="$emit('click:product')">
              <p class="uppercase">{{ title }}</p>
              <p class="mb-1" data-test-id="product-card-product-name">
                {{ name }}
              </p>
              <slot name="description-price" :price="price">
                <ProductPrice
                  v-if="price"
                  v-bind="{ price, lowestPriorPrice }"
                  :applied-reductions="price?.appliedReductions"
                  :size="viewport.isGreaterThan('md') ? 'sm' : 'xs'"
                  type="whisper" />
              </slot>
            </DefaultLink>
            <div class="mt-2">
              <slot name="description-action" :colors="colors">
                <ProductSiblingPicker
                  :items="siblings"
                  :spacing="siblingSpacing"
                  class="flex pb-1">
                  <template #item="{ item }">
                    <DefaultLink :to="getProductDetailRoute(product, item.id)">
                      <ColorChip
                        v-if="item.colors.length"
                        data-test-id="product-card-color-circle"
                        :color="asProductColor(item.colors[0])"
                        :size="colorChipSize"
                        :rounded="colorChipRoundedSize" />
                    </DefaultLink>
                  </template>
                </ProductSiblingPicker>
              </slot>
            </div>
          </div>
        </slot>
      </article>
      <!-- </Intersect> -->
    </slot>
  </div>
</template>

<script setup lang="ts">
import {
  ProductColor,
  Product,
  getProductAndSiblingsColors,
  getProductSiblings,
  getFirstAttributeValue,
  Value,
} from '@scayle/storefront-nuxt'

const props = defineProps({
  index: {
    type: Number,
    required: false,
    default: -1,
  },
  product: {
    type: Object as PropType<Product>,
    default: () => ({}),
  },
  loading: {
    type: Boolean,
    default: false,
  },
  badgeLabel: {
    type: String,
    default: null,
  },
  isAvailable: {
    type: Boolean,
    default: true,
  },
  isWishlistCard: {
    type: Boolean,
    default: false,
  },
  wishlistRemoveIcon: {
    type: String as PropType<'heart' | 'close'>,
    default: undefined,
  },
  colorChipSize: {
    type: String as PropType<'sm' | 'md'>,
    default: 'md',
  },
  colorChipRoundedSize: {
    type: String as PropType<'sm' | 'md'>,
    default: 'md',
  },
  siblingSpacing: {
    type: String as PropType<'default' | 'narrow'>,
    default: 'default',
  },
})

const loadHoverImage = ref(false)
const shouldHoverImage = ref(false)

const viewport = useViewport()

const onMouseOver = () => {
  loadHoverImage.value = true
  shouldHoverImage.value = true
  emit('productimage:mouseover')
}

const onMouseLeave = () => {
  shouldHoverImage.value = false
  emit('productimage:mouseleave')
}

const title = computed(() => {
  return getFirstAttributeValue(props.product.attributes, 'brand')?.label
})

const name = computed(() => {
  return getFirstAttributeValue(props.product.attributes, 'name')?.label ?? ''
})

const price = computed(() => {
  return getLowestPriceBetweenVariants(props.product)
})
const lowestPriorPrice = computed(() => {
  return getVariantWithLowestPrice(props.product.variants)?.lowestPriorPrice
})

const colors = computed(() => {
  return getProductAndSiblingsColors(props.product, 'color')
})

const image = computed(() => {
  return getImageFromList(props.product.images, ProductImageType.BUST, 'front')
})

const imageLoading = computed(() => (!props.index ? 'eager' : 'lazy'))

const hoverImage = computed(() => {
  const modelImageOrFirstAvailable = getFirstModelImage(
    props.product.images,
    props.index,
  )
  const hoverImageIsTheSameAsMain =
    modelImageOrFirstAvailable?.hash === image.value?.hash

  if (hoverImageIsTheSameAsMain && props.product.images.length > 0) {
    return props.product.images[1]
  }
  return modelImageOrFirstAvailable
})

const siblings = computed(
  () => getProductSiblings(props.product, 'color') || [],
)

const link = computed(() => getProductDetailRoute(props.product))

const imageClasses = computed(() => ({
  'group-hover:opacity-0': hoverImage.value && props.isAvailable,
  'opacity-20': !props.isAvailable,
}))

const headerActionsClass = computed(() => ({
  'lg:opacity-0':
    props.isWishlistCard && !shouldHoverImage && props.isAvailable,
}))

const asProductColor = (value: Value) => value as ProductColor

const emit = defineEmits<{
  (e: 'intersect:product', value: number): void
  (e: 'productimage:mouseover'): void
  (e: 'productimage:mouseleave'): void
  (e: 'click:product'): void
}>()

const article = ref(null)

useIntersectionObserver(
  article,
  () => {
    emit('intersect:product', props.product.id)
  },
  { threshold: [0, 0.2] },
)
</script>
