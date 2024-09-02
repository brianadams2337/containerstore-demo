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

        <div class="my-3 flex h-12 items-center space-x-4">
          <VariantPicker
            v-model="activeVariant"
            :variants="variants"
            :automatic-discount-promotion="automaticDiscountPromotion"
            :has-one-variant-only="hasOneVariantOnly"
          />
          <IconClose class="size-4 text-gray-500 max-sm:hidden" />
          <input v-model="quantity" type="number" class="h-full w-1/3" />
        </div>
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
        <div
          v-if="product?.isSoldOut"
          class="rounded-xl bg-red-100 p-4 text-md text-red"
        >
          {{ $t('pdp.sold_out') }}
        </div>
        <SFButton :disabled="!activeVariant" @click="addToBasket">{{
          $t('basket.add_to_basket')
        }}</SFButton>
        <div class="h-screen bg-slate-400">placeholder</div>
      </div>
    </div>
    <template #loading>
      <SFSkeletonLoader />
    </template>
  </AsyncDataWrapper>
</template>

<script setup lang="ts">
import { useSeoMeta } from '@unhead/vue'
import { computed, defineOptions, ref } from 'vue'
import type { Price } from '@scayle/storefront-nuxt'
import {
  definePageMeta,
  useBasket,
  useHead,
  useJsonld,
  useProduct,
  useProductBaseInfo,
  useProductPromotions,
  useProductSeoData,
  useRoute,
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

if (error.value) {
  throw error.value
}

const quantity = ref(1)

const { name, brand, longestCategoryList, hasOneVariantOnly, variants } =
  useProductBaseInfo(product)

const activeVariant = ref(
  hasOneVariantOnly.value ? variants.value[0] : undefined,
)

const { addItem, items } = useBasket()

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

const { automaticDiscountPromotion } = useProductPromotions(product)

const addToBasket = () => {
  if (!activeVariant.value) {
    return
  }
  addItem({
    variantId: activeVariant.value?.id,
    quantity: quantity.value,
    promotionId: automaticDiscountPromotion.value?.id,
  })
}

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
