<template>
  <ProductCard
    v-bind="{ index, isAvailable }"
    :id="item.product.id"
    :product="item.product"
    :loading="isWishlistFetching"
    class="col-span-6 md:col-span-4 2xl:col-span-3"
    wishlist-remove-icon="close"
    is-wishlist-card
    @productimage:mouseover="isAddToBasketButtonShown = true"
    @productimage:mouseleave="isAddToBasketButtonShown = false"
  >
    <template #badge>
      <ProductBadges
        :product="item.product"
        class="absolute bottom-0 left-0 w-full"
      />
    </template>
    <template #header-image="{ link, image, imageLoading, name }">
      <WishlistCardImage
        v-bind="{ index, item, link, image, imageLoading, name }"
      />
    </template>
    <template #description="{ title, name }">
      <WishlistCardDescription v-bind="{ index, item, title, name }" />
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

const { fetching: isWishlistFetching } = await useWishlist()

const wishlistItem = computed(() => props.item)

const { isAvailable } = useWishlistItem(wishlistItem)

const { isAddToBasketButtonShown } = await useWishlistItemActions(wishlistItem)
</script>
