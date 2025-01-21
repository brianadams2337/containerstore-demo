<template>
  <li
    class="border border-x-0 border-b-0 p-1 first-of-type:border-t-0 hover:bg-secondary-450"
  >
    <SFLocalizedLink
      :to="getProductDetailRoute(basketItem.product.id, name)"
      class="relative flex w-full flex-wrap rounded-xl p-3 text-sm text-primary"
      :class="{ 'opacity-60': isSoldOut }"
    >
      <div class="mr-5 flex flex-1">
        <SFBasketCardImage
          :basket-item="basketItem"
          :is-sold-out="isSoldOut"
          is-small-size
          hide-wishlist-toggle
          class="mr-3"
        />
        <div class="flex flex-col items-start space-x-1">
          <span
            class="mt-2 block truncate px-1 text-base font-medium leading-none text-gray-900"
          >
            {{ brand }}
          </span>
          <span
            class="mb-2 mt-1 block truncate rounded py-px text-base font-normal text-gray-900"
          >
            {{ name }}
          </span>
          <SFBasketCardDetails :item="basketItem" is-quantity-shown />
        </div>
      </div>
      <SFProductPrice
        :price="price"
        :lowest-prior-price="basketItem?.variant?.lowestPriorPrice"
        :promotion="basketItem.promotion"
        :show-badges="!isFreeGift"
        class="absolute bottom-3 right-3"
        data-testid="basket-card-prices"
        :inline="false"
      />
    </SFLocalizedLink>
  </li>
</template>

<script setup lang="ts">
import type { BasketItem } from '@scayle/storefront-nuxt'
import SFBasketCardImage from '../SFBasketCardImage.vue'
import SFBasketCardDetails from '../SFBasketCardDetails.vue'
import SFProductPrice from '~/components/product/SFProductPrice.vue'
import SFLocalizedLink from '~/components/SFLocalizedLink.vue'
import {
  useProductBaseInfo,
  useRouteHelpers,
  useBasketItem,
} from '~/composables'

const { basketItem } = defineProps<{ basketItem: BasketItem }>()

const { getProductDetailRoute } = useRouteHelpers()

const { name, brand } = useProductBaseInfo(basketItem.product)

const { isSoldOut, isFreeGift, price } = useBasketItem(() => basketItem)
</script>
