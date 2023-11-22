<template>
  <div
    :data-product-card-id="product.id"
    :class="{ 'animate-pulse': loading }"
    class="group relative"
  >
    <slot>
      <Intersect @enter="emit('intersect:product', props.product.id)">
        <article :id="`product-${product.id}`" class="flex h-full flex-col">
          <slot name="header">
            <div
              class="group relative flex aspect-[3/4] max-h-md items-center justify-center bg-gray-200"
              @mouseover="onMouseOver"
              @mouseleave="onMouseLeave"
            >
              <slot v-if="product" name="header-actions">
                <ClientOnly>
                  <ProductCardHeaderActions
                    v-bind="{ product, wishlistRemoveIcon, listingMetaData }"
                    :class="headerActionsClass"
                    class="opacity-100 transition"
                  />
                </ClientOnly>
              </slot>
              <slot
                name="header-image"
                v-bind="{
                  image,
                  imageLoading,
                  imageClasses,
                  link,
                  hoverImage,
                  loadHoverImage,
                  name,
                }"
              >
                <slot name="button" />
                <DefaultLink
                  :to="link"
                  raw
                  @click.capture="$emit('click:product')"
                >
                  <ProductImage
                    v-if="image"
                    v-bind="{ image, imageLoading }"
                    :alt="name"
                    :class="imageClasses"
                    fit="contain"
                    sizes="sm:100vw"
                    is-centered
                    class="absolute inset-0 transition duration-200"
                  />
                  <div
                    v-if="hoverImage && loadHoverImage"
                    class="opacity-0 transition duration-300 group-hover:opacity-100"
                  >
                    <FadeInTransition :duration="300">
                      <ProductImage
                        :image="hoverImage"
                        :image-loading="imageLoading"
                        :alt="name"
                        sizes="sm:100vw"
                        fit="cover"
                        class="absolute inset-0"
                      />
                    </FadeInTransition>
                  </div>
                </DefaultLink>
              </slot>
              <ProductPromotionBadge
                :product="product"
                class="absolute bottom-3 left-3 top-auto"
              />

              <slot name="header-badge" :label="badgeLabel">
                <DefaultLink
                  v-if="badgeLabel"
                  :to="link"
                  raw
                  @click.capture="$emit('click:product')"
                >
                  <ProductBadge
                    :badge-label="badgeLabel"
                    class="absolute left-0 top-0"
                  />
                </DefaultLink>
              </slot>
            </div>
          </slot>
          <slot
            name="description"
            v-bind="{ ...$props, name, price, title, lowestPriorPrice }"
          >
            <div class="my-2 px-2.5 md:my-2.5">
              <DefaultLink
                :to="link"
                raw
                class="flex flex-col whitespace-pre-line break-words text-2xs font-medium uppercase leading-tight text-primary opacity-50 sm:leading-4 md:text-xs"
                @click.capture="$emit('click:product')"
              >
                <p class="overflow-hidden uppercase">{{ title }}</p>
                <p data-test-id="product-card-product-name">{{ name }}</p>
                <slot name="description-price" :price="price">
                  <ProductPrice
                    v-if="price"
                    v-bind="{ price, lowestPriorPrice }"
                    :applied-reductions="price?.appliedReductions"
                    :size="isGreaterOrEquals('md') ? 'sm' : 'xs'"
                    type="whisper"
                  />
                </slot>
              </DefaultLink>
              <div class="mt-2">
                <slot name="description-action" :colors="colors">
                  <ProductSiblingPicker
                    :items="siblings"
                    :spacing="siblingSpacing"
                    class="flex pb-1"
                  >
                    <template #item="{ item }">
                      <DefaultLink
                        :to="getProductDetailRoute(product, item.id)"
                        raw
                      >
                        <ColorChip
                          v-if="item.colors.length"
                          data-test-id="product-card-color-circle"
                          :color="item.colors[0] as ProductColor"
                          :size="colorChipSize"
                          :rounded="colorChipRoundedSize"
                        />
                      </DefaultLink>
                    </template>
                  </ProductSiblingPicker>
                </slot>
              </div>
            </div>
          </slot>
        </article>
      </Intersect>
    </slot>
  </div>
</template>

<script setup lang="ts">
import type { ProductColor, Product } from '@scayle/storefront-nuxt'

type Props = {
  product: Product
  index?: number
  loading?: boolean
  isAvailable?: boolean
  badgeLabel?: string
  isWishlistCard?: boolean
  wishlistRemoveIcon?: 'heart' | 'close'
  colorChipSize?: 'sm' | 'md'
  colorChipRoundedSize?: 'sm' | 'md'
  siblingSpacing?: 'default' | 'narrow'
  listingMetaData?: ListItem
}

const props = withDefaults(defineProps<Props>(), {
  index: -1,
  loading: false,
  badgeLabel: undefined,
  isAvailable: true,
  isWishlistCard: false,
  wishlistRemoveIcon: undefined,
  colorChipSize: 'md',
  colorChipRoundedSize: 'md',
  siblingSpacing: 'default',
  listingMetaData: undefined,
})

const loadHoverImage = ref(false)
const shouldHoverImage = ref(false)

const { isGreaterOrEquals } = useViewport()

const onMouseOver = () => {
  loadHoverImage.value = true
  shouldHoverImage.value = true
  emit('productimage:mouseover')
}

const onMouseLeave = () => {
  shouldHoverImage.value = false
  emit('productimage:mouseleave')
}

const {
  brand: title,
  name,
  price,
  lowestPriorPrice,
  colors,
  image,
  siblings,
  link,
} = useProductBaseInfo(props.product)

const imageLoading = computed<'eager' | 'lazy'>(() =>
  !props.index ? 'eager' : 'lazy',
)

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
