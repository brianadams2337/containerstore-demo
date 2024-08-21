<template>
  <div
    :data-testid="id"
    :class="{ 'animate-pulse': loading }"
    class="group relative"
  >
    <Intersect @enter="emit('intersect:product', props.product.id)">
      <article
        :id="id"
        class="flex h-full flex-col"
        @mouseover="onMouseOver"
        @mouseleave="onMouseLeave"
      >
        <slot
          name="header"
          v-bind="{ ...$props, name, brand, link, isProductHovered }"
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
            <slot v-if="product" name="header-actions">
              <ProductCardHeaderActions
                :product="product"
                :listing-meta-data="listingMetaData"
                :class="{ 'lg:opacity-0': areHeaderActionsHidden }"
                class="opacity-100 transition"
              />
            </slot>
            <slot name="header-badges" />
            <slot
              name="header-image"
              :image="image"
              :link="link"
              :is-product-hovered="isProductHovered"
              v-bind="{ name }"
            >
              <slot name="button" />
              <template v-if="link && image">
                <ProductCardImage
                  v-if="shouldShowSingleImage"
                  :image="image"
                  :alt="alt"
                  :link="link"
                  :is-available="isAvailable"
                  :product-index="index"
                  @click.capture="$emit('click:product')"
                />

                <ProductCardImageSlider
                  v-else
                  :image="image"
                  :alt="alt"
                  :link="link"
                  :is-available="isAvailable"
                  :is-product-hovered="isProductHovered"
                  :product-index="index"
                  :images="product.images"
                  @click.capture="$emit('click:product')"
                />
              </template>
            </slot>
            <slot name="footer-badges" :label="badgeLabel">
              <ProductBadge
                v-if="badgeLabel"
                :text="badgeLabel"
                class="absolute left-3 top-3"
              />
            </slot>
          </div>
        </slot>
        <slot
          name="details"
          v-bind="{ ...$props, name, price, brand, lowestPriorPrice }"
        >
          <ProductCardDetails
            v-if="link && product"
            :product="product"
            :is-product-hovered="isProductHovered"
            :link="link"
            @click.capture="$emit('click:product')"
          />
        </slot>
      </article>
    </Intersect>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import type { Product } from '@scayle/storefront-nuxt'
import { useProductBaseInfo } from '~/composables'

type Props = {
  product: Product
  index?: number
  loading?: boolean
  isRightSideBorderless?: boolean
  edgeBorderless?: boolean
  isAvailable?: boolean
  badgeLabel?: string
  isWishlistCard?: boolean
  multipleImages?: boolean
  listingMetaData?: ListItem
}

const props = withDefaults(defineProps<Props>(), {
  index: -1,
  loading: false,
  badgeLabel: undefined,
  isAvailable: true,
  isWishlistCard: false,
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

const { brand, name, alt, price, lowestPriorPrice, image, link } =
  useProductBaseInfo(props.product)

const areHeaderActionsHidden = computed(() => {
  return props.isWishlistCard && !isProductHovered.value && props.isAvailable
})

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
