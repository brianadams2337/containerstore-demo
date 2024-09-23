<template>
  <div>
    <SFLink
      :to="getProductDetailRoute(product.id, name)"
      class="relative overflow-hidden rounded-md bg-gray-200"
    >
      <ProductImage
        v-if="image"
        :image="image"
        sizes="xs:100vw sm:100vw md:100vw"
        fit="cover"
        :image-loading="!index ? 'eager' : 'lazy'"
        class="h-44 w-32 p-1"
      />
      <ProductPromotionFreeGiftBadge
        :background-color-style="giftBackgroundColorStyle"
        class="absolute left-0 top-0"
      />
    </SFLink>
    <p
      class="mt-1 overflow-hidden break-words text-2xs font-medium uppercase text-secondary"
    >
      {{ brand }}
    </p>
    <SFHeadline tag="h1" size="sm" class="mb-1 font-semibold">
      {{ name }}
    </SFHeadline>
  </div>
  <SFButton size="sm" class="mt-2" @click="toggleGiftSelection()">
    {{ toggleGiftSelectionLabel }}
  </SFButton>
  <template v-if="giftPromotion">
    <ProductPromotionSelectionModal
      :product="product"
      :promoted-product="promotedProduct"
      :promotion="giftPromotion"
      :background-color-style="giftBackgroundColorStyle"
    />
  </template>
</template>

<script setup lang="ts">
import { computed, toRef } from 'vue'
import type { BasketItem, Product } from '@scayle/storefront-nuxt'
import { useI18n } from '#i18n'
import {
  useBasketItemPromotion,
  useProductBaseInfo,
  usePromotionGiftSelection,
  useRouteHelpers,
} from '~/composables'

type Props = {
  product: Product
  basketItem: BasketItem
  index: number
}

const props = defineProps<Props>()

const i18n = useI18n()
const { getProductDetailRoute } = useRouteHelpers()

const promotedProduct = computed(() => props.basketItem.product)

const { toggleGiftSelection } = await usePromotionGiftSelection(props.product)

const { giftPromotion, giftBackgroundColorStyle } = useBasketItemPromotion(
  toRef(props.basketItem),
)

const toggleGiftSelectionLabel = computed(() => {
  return i18n.t('basket.promotion.add_free_gift')
})

const { image, brand, name } = useProductBaseInfo(props.product)
</script>
