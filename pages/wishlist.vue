<template>
  <div class="container">
    <div class="mt-8">
      <Headline size="xl" class="font-semibold text-primary">
        {{ $t('wishlist.heading') }}
      </Headline>
      <p
        data-test-id="wishlist-count"
        class="mt-4 text-xs font-semibold text-secondary">
        {{ $t('wishlist.products_count', count) }}
      </p>
    </div>
    <template v-if="fetchingBasket">
      <div class="mt-8 flex flex-wrap">
        <SkeletonLoader
          v-for="index in count"
          :key="`product-loading-${index}`"
          type="custom"
          class="mb-40 mr-2 h-96 w-80" />
      </div>
    </template>
    <template v-else>
      <div v-if="count" class="mt-8 grid w-auto grid-cols-12 gap-2">
        <WishlistCard
          v-for="({ key, product, variant }, index) in orderedItems"
          v-bind="{ product, variant, index }"
          :key="`product-${key}`"
          data-test-id="wishlist-card"
          class="mb-4"
          @click:add-to-cart="addItemToCart(key, +index)" />
      </div>
      <div v-if="count === 0" class="mt-8 space-y-8">
        <EmptyState
          :title="$t('wishlist.no_items_info')"
          :description="$t('wishlist.continue_shopping_info')"
          icon="IconEmptyWishlist"
          show-default-actions />
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import {
  WishlistItem,
  getFirstAttributeValue,
  Product,
  getAttributeValue,
} from '@scayle/storefront-nuxt'
import { ONE_SIZE_KEY, WishlistListingMetadata } from '~/constants'
import { Action } from '~/constants/toast'

const listingMetaData = {
  id: WishlistListingMetadata.ID,
  name: WishlistListingMetadata.NAME,
} as const

const wishlist = await useWishlist({ options: { lazy: true } })
const basket = await useBasket({ options: { lazy: true } })
const { $alert, $i18n } = useNuxtApp()

const {
  trackViewItemList,
  trackWishlist,
  trackAddToBasket,
  collectProductListItems,
} = useTrackingEvents()

if (wishlist.error.value) {
  throw wishlist.error.value
}

const addItemToCart = async (itemKey: string, index: number) => {
  const entry = wishlist.data.value?.items.find((el) => el.key === itemKey)

  if (!entry || !entry.product) {
    return
  }

  // @ts-ignore
  if (!entry.variant && entry.variantId) {
    // @ts-ignore
    entry.variant = getVariant(entry.product.variants!, entry.variantId)
  }

  if (
    !entry.variant &&
    entry.product?.variants?.length === 1 &&
    getAttributeValue(entry.product?.variants[0]?.attributes, 'size') ===
      ONE_SIZE_KEY
  ) {
    entry.variant = entry.product?.variants[0]
  }

  if (!entry.variant?.id) {
    $alert.show($i18n.t('basket.notification.select_size'), Action.CONFIRM)
    return
  }

  await basket.addItem({
    variantId: entry.variant.id,
    quantity: 1,
  })

  showBasketFlyOut()

  const { product } = entry
  let { variant = undefined } = entry
  if (!variant && product && product.variants?.length) {
    variant = product.variants[0]
  }

  if (product) {
    trackAddToBasket({
      product,
      variant,
      index,
      list: listingMetaData,
    })
  }
}

const orderedItems = computed(() => {
  const sortedItems = useAlphabetical(
    wishlist.items.value || [],
    (item: WishlistItem) => {
      return (
        getFirstAttributeValue(item.product?.attributes, 'name')?.label ?? ''
      )
    },
  )
  return sortedItems.filter(
    (item: WishlistItem): item is WishlistItem & { product: Product } => {
      return !!item.product
    },
  )
})

useSeoMeta({
  robots: 'noindex,follow',
  title: $i18n.t('navigation.wishlist'),
})

onMounted(() => {
  if (!wishlist.data.value) {
    return
  }
  trackWishlist(
    collectProductListItems(wishlist.products.value, {
      listId: listingMetaData.id,
      listName: listingMetaData.name,
    }),
  )
  trackViewItemList({
    items: wishlist.products.value,
    listingMetaData,
    source: 'wishlist',
  })
})

const count = wishlist.count
const fetchingBasket = basket.fetching

definePageMeta({ pageType: 'wishlist_page' })
</script>

<script lang="ts">
export default {
  name: 'WishlistPage',
}
</script>
