<template>
  <div>
    <DefaultLink
      :to="getProductDetailRoute(product)"
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
        v-if="isFree"
        :background-color-style="backgroundColorStyle"
        class="absolute bottom-2 left-2"
      />
    </DefaultLink>
    <p
      class="mt-1 overflow-hidden break-words text-2xs font-medium uppercase text-secondary"
    >
      {{ brand }}
    </p>
    <Headline tag="h1" size="sm" class="mb-1 font-semibold">
      {{ name }}
    </Headline>
    <ProductPrice
      v-if="price && !isFree"
      v-bind="{ product, price, lowestPriorPrice }"
      size="xs"
      type="whisper"
    />
  </div>
  <AppButton size="sm" class="mt-2" @click="toggleGiftSelection()">
    {{ toggleGiftSelectionLabel }}
  </AppButton>
  <template v-if="giftPromotion">
    <ProductPromotionSelectionModal
      v-if="isGreaterOrEquals('md')"
      v-bind="{ product, promotedProduct }"
      :promotion="giftPromotion"
    />
    <ProductPromotionSizeSelection
      v-else
      v-bind="{ product, promotedProduct }"
      :promotion="giftPromotion"
    />
  </template>
</template>

<script setup lang="ts">
import type { Product, BasketItem } from '@scayle/storefront-nuxt'

type Props = {
  product: Product
  basketItem: BasketItem
  index: number
  isFree?: boolean
}

const props = withDefaults(defineProps<Props>(), { isFree: false })

const i18n = useI18n()

const promotedProduct = computed(() => props.basketItem.product)

const { toggleGiftSelection } = await usePromotionGiftSelection(
  props.product,
  promotedProduct.value,
)

const { isGreaterOrEquals } = useViewport()

const { giftPromotion, backgroundColorStyle } = await useBasketItemPromotion(
  toRef(props.basketItem),
)

const toggleGiftSelectionLabel = computed(() => {
  return i18n.t(
    props.isFree ? 'basket.promotion.add_free_gift' : 'basket.product.add',
  )
})

const { image, price, brand, name, lowestPriorPrice } = useProductBaseInfo(
  props.product,
)
</script>
