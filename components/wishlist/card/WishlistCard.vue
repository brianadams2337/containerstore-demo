<template>
  <ProductCard
    v-bind="{ index, isAvailable }"
    :id="item.product.id"
    :product="item.product"
    :loading="isWishlistFetching"
    class="col-span-6 md:col-span-4 2xl:col-span-3"
    is-wishlist-card
    @product-image:mouseover="isAddToBasketButtonShown = true"
    @product-image:mouseleave="isAddToBasketButtonShown = false"
  >
    <template #header-badges>
      <ProductCardBadgesHeader
        :product="item.product"
        class="absolute left-3 top-3 w-full"
      />
    </template>
    <template #footer-badges>
      <ProductCardBadgesFooter
        :product="item.product"
        class="absolute bottom-0 left-0 w-full"
      />
    </template>
    <template #header-image="{ link, image, name }">
      <WishlistCardImage
        v-if="link"
        v-bind="{ index, item, link, image, name }"
      />
    </template>
    <template #details="{ brand, name }">
      <WishlistCardDescription v-bind="{ index, item, brand, name }" />
      <WishlistCardSlideIn :item="item" />
    </template>
  </ProductCard>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { WishlistItem } from '@scayle/storefront-nuxt'
import { useWishlistItem, useWishlistItemActions } from '~/composables'
import { useWishlist } from '#storefront/composables'

type Props = {
  index: number
  item: WishlistItem
}

const props = defineProps<Props>()

const { fetching: isWishlistFetching } = useWishlist()

const wishlistItem = computed(() => props.item)

const { isAvailable } = useWishlistItem(wishlistItem)

const { isAddToBasketButtonShown } = useWishlistItemActions(wishlistItem)
</script>
