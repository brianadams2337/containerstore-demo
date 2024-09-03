<template>
  <AsyncDataWrapper :status="productDataStatus">
    <div
      v-if="product"
      class="flex flex-col items-start justify-between gap-8 xl:container max-md:space-y-5 md:flex-row md:space-x-4"
    >
      <ProductGallery
        v-if="product"
        :product="product"
        class="md:sticky md:top-8 md:w-1/2"
        product-image-slider-class="md:max-w-[528px]"
      />
      <div class="flex w-full flex-col gap-4 max-md:px-5 md:w-1/2">
        <ProductBreadcrumbs
          v-if="longestCategoryList"
          class="mb-8 hidden md:block"
          :product-categories="longestCategoryList"
        />
        <div>
          <div class="font-semi-bold-variable text-gray-900">{{ brand }}</div>
          <SFHeadline
            size="lg"
            class="text-md !font-normal text-gray-600 md:text-lg"
            data-testid="pdp-product-name"
            tag="h1"
          >
            {{ name }}
          </SFHeadline>
        </div>

        <ProductPromotionBanners v-if="product" :product="product" />

        <ProductPrice
          v-if="price"
          size="lg"
          class="mt-3"
          :promotion="automaticDiscountPromotion"
          :price="price"
          type="normal"
          show-tax-info
          :show-price-from="showFrom"
        />
        <ProductPromotionBanners :product="product" />
        <ProductActions
          v-model:active-variant="activeVariant"
          :product="product"
          :promotion="automaticDiscountPromotion ?? undefined"
        />
        <SFFadeInTransition>
          <StoreVariantAvailability
            v-if="activeVariant?.id"
            :selected-store-id="selectedStoreId"
            :variant-id="activeVariant.id"
          />
        </SFFadeInTransition>
        <LazyStoreLocatorSlideIn
          v-if="activeVariant?.id"
          v-model:selectedStoreId="selectedStoreId"
          :variant-id="activeVariant.id"
        />
        <div class="h-screen bg-slate-400">placeholder adas</div>
      </div>
    </div>
    <template #loading>
      <SFSkeletonLoader />
    </template>
  </AsyncDataWrapper>
</template>

<script setup lang="ts">
import { whenever } from '@vueuse/core'
import { useSeoMeta } from '@unhead/vue'
import { computed, defineOptions, ref } from 'vue'
import type { Price, Variant } from '@scayle/storefront-nuxt'
import { useProductPromotions } from '~/composables/useProductPromotions'
import { useFavoriteStore } from '~/composables/useFavoriteStore'
import {
  definePageMeta,
  useBasket,
  useHead,
  useJsonld,
  useProduct,
  useProductBaseInfo,
  useProductSeoData,
  useRoute,
} from '#imports'
import { PRODUCT_WITH_PARAMS } from '~/constants'
import StoreVariantAvailability from '~/components/locator/StoreVariantAvailability.vue'

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

if (error.value) {
  throw error.value
}

const { name, brand, longestCategoryList, hasOneVariantOnly, variants } =
  useProductBaseInfo(product)
// On client side we need to wait for the data to be loaded before we know if a product has only one variant
whenever(hasOneVariantOnly, () => {
  activeVariant.value = variants.value[0]
})

const { automaticDiscountPromotion } = useProductPromotions(product)

const { items } = useBasket()
const activeVariant = ref<Variant>()

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
</script>
