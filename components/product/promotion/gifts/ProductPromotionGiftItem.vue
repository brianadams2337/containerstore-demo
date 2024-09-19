<template>
  <div class="flex w-full rounded-xl" data-testid="product-promotion-gift-item">
    <div class="relative flex shrink-0 items-center rounded-xl bg-gray-200">
      <ProductImage
        v-if="image"
        :image="image"
        :alt="name"
        :image-loading="eagerImageLoading ? 'eager' : 'lazy'"
        sizes="92px"
        aspect-ratio="1/1"
        class="size-24"
        :class="{
          'opacity-20': disabled,
        }"
      />
      <ProductPromotionFreeGiftBadge
        :background-color-style="backgroundColorStyle"
        class="absolute left-0 top-0"
      />
    </div>
    <div class="flex w-full flex-row items-center justify-between p-3">
      <div class="flex h-full flex-col justify-between">
        <div>
          <div
            class="text-sm font-semi-bold-variable"
            :class="disabled ? 'text-gray-400' : 'text-gray-900'"
          >
            {{ brand }}
          </div>
          <SFHeadline
            size="lg"
            data-testid="pdp-product-name"
            tag="h3"
            class="text-sm !font-normal"
            :class="disabled ? 'text-gray-400' : 'text-gray-600'"
          >
            {{ name }}
          </SFHeadline>
        </div>
        <div class="flex flex-row items-end gap-2">
          <ProductPrice
            v-if="price"
            :class="{ disabled: 'opacity-50' }"
            :price="price"
            :show-badges="false"
          />
        </div>
      </div>

      <div class="flex items-end justify-between">
        <SFButton
          size="sm"
          type="raw"
          class="size-9 rounded-xl bg-gray-200"
          :disabled="!areGiftConditionsMet"
          @click="toggleGiftSelection()"
        >
          <IconNewPlus class="size-6" />
        </SFButton>
      </div>
    </div>
    <ClientOnly>
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
    </ClientOnly>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { CentAmount, Product } from '@scayle/storefront-nuxt'
import { useProduct } from '#storefront/composables'
import {
  useDefaultBreakpoints,
  useProductBaseInfo,
  useProductPromotions,
  usePromotionGiftSelection,
} from '~/composables'
import { PRODUCT_WITH_PARAMS } from '~/constants'
import { useRoute } from '#app/composables/router'
import { createCustomPrice } from '~/utils'

type Props = {
  product: Product
  backgroundColorStyle: { backgroundColor?: string }
  eagerImageLoading: boolean
  disabled?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  disabled: false,
})

const route = useRoute()

const productId = computed(() => {
  return parseInt(route.params.id.toString())
})

const { data: promotedProduct } = useProduct({
  params: {
    id: productId.value,
    with: PRODUCT_WITH_PARAMS,
  },
  key: `product-promotion-gift-item-${productId.value}`,
})

const { md: isGreaterThanMd } = useDefaultBreakpoints()

const { promotion, areGiftConditionsMet } =
  useProductPromotions(promotedProduct)

const { toggleGiftSelection } = usePromotionGiftSelection(props.product)

const { name, image, variantWithLowestPrice, brand } = useProductBaseInfo(
  props.product,
)

const price = computed(() => {
  if (!variantWithLowestPrice.value) {
    return
  }

  return createCustomPrice(variantWithLowestPrice.value?.price, {
    withTax: 0 as CentAmount,
    appliedReductions: [
      {
        amount: {
          absoluteWithTax: variantWithLowestPrice.value?.price
            .withTax as CentAmount,
          relative: 1,
        },
        type: 'relative',
        category: 'promotion',
      },
    ],
  })
})
</script>
