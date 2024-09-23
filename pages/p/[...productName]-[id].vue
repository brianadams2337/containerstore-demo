<template>
  <AsyncDataWrapper :status="productDataStatus">
    <div v-if="product" class="xl:container">
      <div
        class="flex flex-col items-start justify-between gap-8 max-md:space-y-5 md:flex-row"
      >
        <ProductGallery
          v-if="product"
          :product="product"
          class="md:sticky md:top-8 md:w-1/2"
          product-image-slider-class="md:max-w-[528px]"
        />
        <div class="flex w-full flex-col gap-4 md:w-1/2">
          <ProductBreadcrumbs
            v-if="longestCategoryList"
            class="mb-8 hidden max-md:px-5 md:block"
            :product-categories="longestCategoryList"
          />
          <div class="max-md:px-5">
            <div class="truncate font-semi-bold-variable text-gray-900">
              {{ brand }}
            </div>
            <SFHeadline
              size="lg"
              class="text-md !font-normal text-gray-600 md:text-lg"
              data-testid="pdp-product-name"
              tag="h1"
            >
              <span class="truncate">
                {{ name }}
              </span>
            </SFHeadline>
          </div>

          <div class="flex flex-col max-md:px-5 md:flex-col-reverse">
            <ProductPrice
              v-if="price"
              size="lg"
              class="mt-3"
              :promotion="promotion"
              :price="price"
              type="normal"
              show-tax-info
              :show-price-from="showFrom"
            />
            <ProductPromotionBanners :product="product" />
          </div>
          <ProductActions
            v-model:active-variant="activeVariant"
            :product="product"
            :promotion="promotion ?? undefined"
          />

          <ProductPromotionGifts
            v-if="
              promotion && isBuyXGetYType(promotion) && !isGiftAddedToBasket
            "
            :product="product"
            :are-gift-conditions-met="areGiftConditionsMet"
            :promotion="promotion"
            class="mt-6 max-md:px-5"
          />

          <SFFadeInTransition>
            <StoreVariantAvailability
              v-if="activeVariant?.id"
              class="max-md:mx-5"
              :selected-store-id="selectedStoreId"
              :variant-id="activeVariant.id"
            />
          </SFFadeInTransition>
          <LazyStoreLocatorSlideIn
            v-if="activeVariant?.id"
            v-model:selected-store-id="selectedStoreId"
            :variant-id="activeVariant.id"
          />
        </div>
      </div>
      <ProductDetails :product="product" />
      <ProductRecommendations
        v-if="recommendedProductIds.length"
        :product-ids="recommendedProductIds"
        :title="$t('global.product_recommendation')"
      />
    </div>
    <template #loading>
      <SFSkeletonLoader />
    </template>
  </AsyncDataWrapper>
</template>

<script setup lang="ts">
import { whenever } from '@vueuse/core'
import { useSeoMeta } from '@unhead/vue'
import { computed, defineOptions, onMounted, ref } from 'vue'
import type { Price, Variant } from '@scayle/storefront-nuxt'
import { isBuyXGetYType } from '~/utils/promotion'
import { useFavoriteStore } from '~/composables/useFavoriteStore'
import {
  definePageMeta,
  getCombineWithProductIds,
  useBasket,
  useHead,
  useJsonld,
  usePageState,
  useProduct,
  useProductBaseInfo,
  useProductSeoData,
  useProductPromotions,
  useRoute,
  useTrackingEvents,
} from '#imports'
import { PRODUCT_WITH_PARAMS } from '~/constants'

definePageMeta({
  validate(route) {
    return typeof route.params.id === 'string' && /^\d+$/.test(route.params.id)
  },
})
defineOptions({ name: 'ProductDetail' })

const route = useRoute()

const productId = computed(() => {
  return parseInt(route.params.id.toString())
})

const {
  data: product,
  status: productDataStatus,
  error,
} = useProduct({
  params: {
    id: productId.value,
    with: PRODUCT_WITH_PARAMS,
  },
  key: `PDP-${productId.value}`,
})

whenever(error, () => {
  throw error.value
})

const { name, brand, longestCategoryList, hasOneVariantOnly, variants } =
  useProductBaseInfo(product)

const { isGiftAddedToBasket, areGiftConditionsMet, promotion } =
  useProductPromotions(product)

const { items } = useBasket()
const activeVariant = ref<Variant>()
// On client side we need to wait for the data to be loaded before we know if a product has only one variant
whenever(
  hasOneVariantOnly,
  () => {
    activeVariant.value = variants.value[0]
  },
  { immediate: true, once: true },
)

const price = computed(() => {
  const basketVariant = items.value?.find(
    (basketItem) => basketItem.variant.id === activeVariant.value?.id,
  )

  const price = basketVariant
    ? basketVariant.price.unit
    : activeVariant.value
    ? activeVariant.value.price
    : product.value?.priceRange?.min

  return price as Price
})

const showFrom = computed(
  () =>
    !activeVariant.value &&
    product.value?.priceRange?.min.withTax !==
      product.value?.priceRange?.max.withTax,
)

const recommendedProductIds = computed(() => {
  return getCombineWithProductIds(
    product.value?.advancedAttributes?.['combineWith'],
  )
})

// Store selector
const favoriteStoreId = useFavoriteStore()
const selectedStoreId = ref<number | undefined>(
  favoriteStoreId.value ?? undefined,
)

// SEO
const {
  description,
  canonicalLink,
  robots,
  title,
  productJsonLd,
  productBreadcrumbJsonLd,
} = useProductSeoData(product)

useSeoMeta({
  title,
  description,
  robots,
})
useHead({
  link: canonicalLink,
})
useJsonld(() => [productBreadcrumbJsonLd.value, productJsonLd.value])

// Tracking
onMounted(async () => {
  usePageState().setPageState('typeId', String(productId.value))
  // Wait for the product to be loaded
  whenever(
    product,
    (loadedProduct) => {
      useTrackingEvents().trackViewItem({ product: loadedProduct })
    },
    { immediate: true, once: true },
  )
})
</script>
