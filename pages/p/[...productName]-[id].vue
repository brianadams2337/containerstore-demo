<template>
  <AsyncDataWrapper :status="productDataStatus">
    <div v-if="product" class="xl:container md:max-xl:mx-5">
      <div
        class="flex flex-col items-start gap-8 max-md:space-y-5 md:flex-row md:justify-start"
      >
        <div
          class="flex items-start max-md:w-full md:sticky md:top-8 md:max-w-[700px] md:shrink"
        >
          <ProductGallery v-if="product" :product="product" />
        </div>
        <div class="flex w-full flex-col gap-4 md:max-w-[500px] md:shrink-[4]">
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
          <LazyLocatorStoreLocatorSlideIn
            v-if="activeVariant?.id"
            v-model:selected-store-id="selectedStoreId"
            :variant-id="activeVariant.id"
          />
        </div>
      </div>
      <ProductDetails :product="product" class="py-10 md:ml-24" />
      <hr v-if="recommendedProductIds.length" class="mb-10 md:hidden" />
      <ProductRecommendations
        v-if="recommendedProductIds.length"
        class="max-md:px-5"
        :product-ids="recommendedProductIds"
        :title="$t('global.product_recommendation')"
      />
    </div>
    <template #loading>
      <ProductDetailPageLoadingState />
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
import AsyncDataWrapper from '~/components/AsyncDataWrapper.vue'
import ProductGallery from '~/components/product/detail/productGallery/ProductGallery.vue'
import ProductBreadcrumbs from '~/components/product/ProductBreadcrumbs.vue'
import ProductPrice from '~/components/product/ProductPrice.vue'
import ProductPromotionBanners from '~/components/product/promotion/banners/ProductPromotionBanners.vue'
import ProductActions from '~/components/product/detail/ProductActions.vue'
import ProductPromotionGifts from '~/components/product/promotion/gifts/ProductPromotionGifts.vue'
import StoreVariantAvailability from '~/components/locator/StoreVariantAvailability.vue'
import ProductDetails from '~/components/product/ProductDetails.vue'
import ProductRecommendations from '~/components/product/ProductRecommendations.vue'
import { LazyLocatorStoreLocatorSlideIn } from '#components'
import { SFHeadline, SFFadeInTransition } from '#storefront-ui/components'
import ProductDetailPageLoadingState from '~/components/product/detail/ProductDetailPageLoadingState.vue'

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
onMounted(() => {
  whenever(
    hasOneVariantOnly,
    () => {
      activeVariant.value = variants.value[0]
    },
    { immediate: true, once: true },
  )
})

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
definePageMeta({ pageType: 'product_detail_page' })

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
