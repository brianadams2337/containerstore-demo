<template>
  <div class="flex w-full">
    <DefaultLink
      :to="getProductDetailRoute(product)"
      raw
      class="relative mr-3 flex w-32 items-center rounded-md bg-gray-200"
    >
      <ProductImage
        v-if="image"
        :image="image"
        :alt="name"
        :image-loading="eagerImageLoading ? 'eager' : 'lazy'"
        sizes="xl:100vw lg:100vw lg:100vw lg:100vw xs:100vw"
        fit="cover"
      />
      <ProductPromotionFreeGiftBadge
        v-bind="{ backgroundColorStyle }"
        class="absolute bottom-2 left-2"
      />
    </DefaultLink>
    <div class="flex w-full flex-col justify-between">
      <Headline size="base" tag="h3" class="mt-2">{{ name }}</Headline>
      <div class="flex items-end justify-between">
        <AppButton
          size="sm"
          :disabled="!isProductAddedToBasket || !areGiftConditionsMet"
          @click="toggleGiftSelection()"
        >
          {{ $t('pdp.promotion.add_for_free_label') }}
        </AppButton>
        <div class="flex flex-col items-end">
          <span
            v-if="variantWithLowestPrice"
            class="text-xs text-gray-600 line-through"
          >
            {{ formatCurrency(variantWithLowestPrice.price.withTax) }}
          </span>
          <span class="text-base font-bold text-black">
            {{ formatCurrency(0) }}
          </span>
          <span class="text-xs text-gray-700">
            {{ $t('price.including_vat') }}
          </span>
        </div>
      </div>
    </div>
    <template v-if="promotion">
      <ProductPromotionSelectionModal
        v-if="isGreaterThanMd"
        v-bind="{ product, promotion, promotedProduct }"
      />
      <ProductPromotionSizeSelection
        v-else
        v-bind="{ product, promotion, promotedProduct }"
      />
    </template>
  </div>
</template>

<script setup lang="ts">
import type { Product } from '@scayle/storefront-nuxt'

const props = defineProps<{
  product: Product
  backgroundColorStyle: { backgroundColor?: string }
  isProductAddedToBasket: boolean
  eagerImageLoading: boolean
}>()

const { product: promotedProduct } = await useProductDetails()
const { formatCurrency } = useFormatHelpers()

const { md: isGreaterThanMd } = useDefaultBreakpoints()

const { buyXGetYPromotion: promotion, areGiftConditionsMet } =
  await useProductPromotions(promotedProduct)

const { toggleGiftSelection } = await usePromotionGiftSelection(
  props.product,
  promotedProduct.value,
)

const { getProductDetailRoute } = useRouteHelpers()

const { name, image, variantWithLowestPrice } = useProductBaseInfo(
  props.product,
)
</script>
