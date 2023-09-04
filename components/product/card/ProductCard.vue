<template>
  <div
    :data-product-card-id="product.id"
    :class="{ 'animate-pulse': loading }"
    class="group relative">
    <slot>
      <!-- TODO: Implement intersection observer component: -->
      <!-- https://vueuse.org/core/useIntersectionObserver/ -->
      <!-- <Intersect :threshold="0.5" @enter="emit('intersect:product', id)"> -->
      <article :id="`product-${product.id}`" class="flex h-full flex-col">
        <slot name="header">
          <div
            class="group relative flex max-h-md items-center justify-center bg-gray-200"
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
              <NuxtLink :to="link" @click.capture="$emit('click:product')">
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
              </NuxtLink>
            </slot>
            <slot name="header-badge" :label="badgeLabel">
              <NuxtLink
                v-if="badgeLabel"
                :to="link"
                @click.capture="$emit('click:product')">
                <ProductBadge
                  :badge-label="badgeLabel"
                  class="absolute left-0 top-0" />
              </NuxtLink>
            </slot>
          </div>
        </slot>
        <slot name="description" v-bind="$props">
          <div class="my-2 px-2.5 md:my-2.5">
            <NuxtLink
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
                  :applied-reductions="price?.appliedReductions ?? []"
                  :size="viewport.isGreaterThan('md') ? 'sm' : 'xs'"
                  type="whisper" />
              </slot>
            </NuxtLink>
            <div class="mt-2">
              <slot name="description-action" :colors="colors">
                <ProductSiblingPicker
                  :items="siblings"
                  :spacing="siblingSpacing"
                  class="flex pb-1">
                  <template #item="{ item }">
                    <NuxtLink
                      :to="route.getProductDetailRoute(product, item.id)">
                      <!-- TODO: Implement color chip component -->
                      <!-- <ColorChip -->
                      <!--   v-if="item.colors.length" -->
                      <!--   data-test-id="product-card-color-circle" -->
                      <!--   :color="item.colors[0]" -->
                      <!--   :size="colorChipSize" -->
                      <!--   :rounded="colorChipRoundedSize" /> -->
                    </NuxtLink>
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
  Product,
  getProductAndSiblingsColors,
  getProductSiblings,
  getFirstAttributeValue,
} from '@scayle/storefront-nuxt'

const props = defineProps({
  index: {
    type: Number,
    required: true,
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

const siblings = computed(() => getProductSiblings(props.product) || [])

const link = computed(() => route.getProductDetailRoute(props.product))

const imageClasses = computed(() => ({
  'group-hover:opacity-0': hoverImage.value && props.isAvailable,
  'opacity-20': !props.isAvailable,
}))

const headerActionsClass = computed(() => ({
  'lg:opacity-0':
    props.isWishlistCard && !shouldHoverImage && props.isAvailable,
}))

const emit = defineEmits<{
  (e: 'intersect:product', value: number): void
  (e: 'productimage:mouseover'): void
  (e: 'productimage:mouseleave'): void
  (e: 'click:product'): void
}>()
</script>
