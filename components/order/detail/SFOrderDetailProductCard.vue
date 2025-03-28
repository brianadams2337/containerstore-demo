<template>
  <SFLocalizedLink
    v-if="link"
    :aria-label="`${brand}, ${name}, ${color}, ${size}`"
    class="flex flex-col gap-1"
    data-testid="order-detail-product-card"
    raw
    :to="link"
  >
    <div class="flex gap-4">
      <SFProductImage
        v-if="image"
        :image="image"
        :alt="alt"
        :sizes="'80px'"
        class="size-20 max-h-20 overflow-hidden rounded-lg border"
        data-testid="order-detail-product-image"
      />
      <div class="flex flex-col gap-3 py-1">
        <SFOrderDetailProductDetails
          :name="name"
          :brand="brand"
          :size="size"
          :color="color"
          :quantity="quantity"
        />
        <SFOrderDetailProductSubscription
          v-if="subscription"
          :subscription="subscription"
        />
      </div>
    </div>
    <div class="flex flex-col justify-end">
      <SFProductPrice
        :price="price"
        class="ml-auto"
        data-testid="order-product-card-prices"
        :inline="false"
        :show-badges="true"
        :lowest-prior-price="lowestPriorPrice"
      />
    </div>
  </SFLocalizedLink>
</template>

<script setup lang="ts">
import SFOrderDetailProductDetails from './SFOrderDetailProductDetails.vue'
import { SFOrderDetailProductSubscription } from '#storefront-subscription/components'
import SFProductPrice from '~/components/product/SFProductPrice.vue'
import SFLocalizedLink from '~/components/SFLocalizedLink.vue'
import type { OrderProduct, OrderVariant, OrderPrice } from '~/types/order'
import { useOrderProductDetails } from '~/composables'
import SFProductImage from '~/components/product/SFProductImage.vue'

const {
  product,
  variant,
  quantity = 1,
  price,
} = defineProps<{
  product: OrderProduct
  variant: OrderVariant
  quantity?: number
  price: OrderPrice
  subscription?: Record<string, string>
}>()

const { name, brand, size, lowestPriorPrice, color, link, image, alt } =
  useOrderProductDetails(
    () => product,
    () => variant,
  )
</script>
