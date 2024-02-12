<template>
  <DefaultLink :to="link" raw>
    <ProductImage
      v-if="image"
      :image="image"
      :image-loading="imageLoading"
      :alt="name"
      sizes="sm:100vw"
      is-centered
      class="absolute inset-0"
    />
  </DefaultLink>
  <div
    v-if="isAvailable"
    class="absolute bottom-0 left-0 top-auto z-40 hidden h-auto w-full p-3 lg:block"
  >
    <AppButton
      type="secondary"
      class="w-full border-gray-350 bg-white p-3 text-xs font-semibold transition"
      :class="isAddToBasketButtonShown ? 'opacity-1' : 'opacity-0'"
      data-test-id="wishlist-card-add-to-cart"
      @click="addItemToCart(index)"
    >
      {{ $t('pdp.add_label') }}
    </AppButton>
  </div>
  <div
    v-else
    class="absolute inset-y-0 flex w-full items-center justify-center"
  >
    <p class="text-xl font-semibold text-[#424144]">
      {{ $t('global.sold_out') }}
    </p>
  </div>
  <div
    v-if="isAvailable"
    class="absolute bottom-0 right-0 top-auto z-30 flex h-auto justify-end pb-[20px] pr-4 lg:hidden"
  >
    <div
      class="flex size-8 cursor-pointer items-center justify-center rounded-full border border-gray-100 bg-white"
      data-test-id="wishlist-card-add-to-cart-mobile"
      @click="showSizePicker(index)"
    >
      <IconAddToCart class="size-5" />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { ProductImage, WishlistItem } from '@scayle/storefront-nuxt'
import type { RouteLocationRaw } from '#vue-router'

type Props = {
  index: number
  item: WishlistItem
  link: RouteLocationRaw
  image: ProductImage | null
  imageLoading: 'lazy' | 'eager'
  name: string
}

const props = defineProps<Props>()

const wishlistItem = computed(() => props.item)

const { isAvailable } = useWishlistItem(wishlistItem)

const { addItemToCart, showSizePicker, isAddToBasketButtonShown } =
  await useWishlistItemActions(wishlistItem)
</script>
