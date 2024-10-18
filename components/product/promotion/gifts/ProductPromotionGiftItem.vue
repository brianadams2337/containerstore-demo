<template>
  <div class="flex w-full rounded-xl" data-testid="product-promotion-gift-item">
    <div class="relative flex shrink-0 items-center rounded-xl bg-gray-200">
      <ProductImage
        v-if="image"
        :image="image"
        :alt="alt"
        :image-loading="eagerImageLoading ? 'eager' : 'lazy'"
        sizes="92px"
        aspect-ratio="1/1"
        class="size-24"
        :class="{ 'opacity-20': disabled }"
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
          class="size-11 rounded-xl bg-gray-200"
          :disabled="disabled"
          @click="toggleGiftSelection()"
        >
          <IconPlus class="size-6" />
        </SFButton>
      </div>
    </div>
    <ClientOnly>
      <template v-if="promotion && product">
        <ProductPromotionSelectionModal
          :product="product"
          :promotion="promotion"
          :background-color-style="backgroundColorStyle"
        />
      </template>
    </ClientOnly>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { CentAmount, Product } from '@scayle/storefront-nuxt'
import ProductPromotionSelectionModal from '../ProductPromotionSelectionModal.vue'
import ProductPrice from '../../ProductPrice.vue'
import ProductImage from '../../ProductImage.vue'
import ProductPromotionFreeGiftBadge from './ProductPromotionFreeGiftBadge.vue'
import { useProductBaseInfo, usePromotionGiftSelection } from '~/composables'
import { createCustomPrice } from '~/utils'
import type { Promotion } from '~/types/promotion'
import { ClientOnly } from '#components'
import { SFButton, SFHeadline } from '#storefront-ui/components'

type Props = {
  product: Product
  promotion: Promotion
  backgroundColorStyle: { backgroundColor?: string }
  eagerImageLoading: boolean
  disabled?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  disabled: false,
})

const { toggleGiftSelection } = usePromotionGiftSelection(props.product)

const { name, image, variantWithLowestPrice, brand, alt } = useProductBaseInfo(
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
