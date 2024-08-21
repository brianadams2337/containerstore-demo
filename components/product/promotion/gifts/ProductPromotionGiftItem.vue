<template>
  <div class="flex w-full" data-testid="product-promotion-gift-item">
    <SFLink
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
        :class="{ grayscale: !areGiftConditionsMet }"
      />

      <ProductPromotionFreeGiftBadge
        :background-color-style="backgroundColorStyle"
        class="absolute bottom-2 left-2"
      />
    </SFLink>
    <div class="flex w-full flex-col justify-between">
      <SFHeadline
        size="base"
        tag="h3"
        class="mt-2"
        :class="{ 'text-secondary': !areGiftConditionsMet }"
      >
        {{ name }}
      </SFHeadline>
      <div class="flex items-end justify-between">
        <SFButton
          size="sm"
          :disabled="!isProductAddedToBasket || !areGiftConditionsMet"
          @click="toggleGiftSelection()"
        >
          {{ $t('pdp.promotion.add_for_free_label') }}
        </SFButton>
        <div class="flex flex-col items-end">
          <span
            v-if="variantWithLowestPrice"
            class="text-xs text-gray-600 line-through"
            :class="{ 'text-secondary': !areGiftConditionsMet }"
          >
            {{ formatCurrency(variantWithLowestPrice.price.withTax) }}
          </span>
          <span
            class="inline rounded-md p-1 text-base font-bold leading-5"
            :class="{ 'text-secondary ': !areGiftConditionsMet }"
            :style="giftStyle"
          >
            {{ formatCurrency(0) }}
          </span>
          <span
            class="text-xs text-gray-700"
            :class="{ 'text-secondary': !areGiftConditionsMet }"
          >
            {{ $t('price.including_vat') }}
          </span>
        </div>
      </div>
    </div>
    <template v-if="promotion && product && promotedProduct">
      <ProductPromotionSelectionModal
        v-if="isGreaterThanMd"
        :product="product"
        :promotion="promotion"
        :promoted-product="promotedProduct"
      />
      <ProductPromotionSizeSelection
        v-else
        :product="product"
        :promotion="promotion"
        :promoted-product="promotedProduct"
      />
    </template>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { Product } from '@scayle/storefront-nuxt'
import { getBackgroundColorStyle, getTextColorStyle } from '~/utils/promotion'
import { AlphaColorMap } from '~/constants/color'
import { useFormatHelpers } from '#storefront/composables'
import {
  useDefaultBreakpoints,
  useProductBaseInfo,
  useProductDetails,
  useProductPromotions,
  usePromotionGiftSelection,
  useRouteHelpers,
} from '~/composables'

const props = defineProps<{
  product: Product
  backgroundColorStyle: { backgroundColor?: string }
  isProductAddedToBasket: boolean
  eagerImageLoading: boolean
}>()

const { product: promotedProduct } = await useProductDetails(
  'product-promotion-gift-item.vue',
)
const { formatCurrency } = useFormatHelpers()

const { md: isGreaterThanMd } = useDefaultBreakpoints()

const { buyXGetYPromotion: promotion, areGiftConditionsMet } =
  useProductPromotions(promotedProduct)

const { toggleGiftSelection } = usePromotionGiftSelection(props.product)

const { getProductDetailRoute } = useRouteHelpers()

const { name, image, variantWithLowestPrice } = useProductBaseInfo(
  props.product,
)

const giftStyle = computed(() => {
  if (areGiftConditionsMet.value) {
    return {
      ...getBackgroundColorStyle(
        promotion.value?.customData.colorHex,
        AlphaColorMap.ALPHA_10,
      ),
      ...getTextColorStyle(
        promotion.value?.customData.colorHex,
        AlphaColorMap.ALPHA_100,
      ),
    }
  }

  return {
    ...getBackgroundColorStyle(
      promotion.value?.customData.colorHex,
      AlphaColorMap.ALPHA_5,
    ),
    ...getTextColorStyle(
      promotion.value?.customData.colorHex,
      AlphaColorMap.ALPHA_20,
    ),
  }
})
</script>
