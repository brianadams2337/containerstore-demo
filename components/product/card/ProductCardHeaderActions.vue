<template>
  <div
    class="absolute left-auto right-0 top-0 z-10 flex h-8 w-auto cursor-pointer p-1 md:p-3">
    <AppButton
      :key="`item-${productId}-is-in-wishlist-${isInWishlist}`"
      :data-test-id="
        isInWishlist
          ? 'product-card-action-remove-item-from-wishlist-button'
          : 'product-card-action-add-item-to-wishlist-button'
      "
      :loading="!!wishlist.pending"
      class="opacity-50"
      type="ghost"
      @click="toggleItemInWishlist">
      <template #icon="{ _class }">
        <IconCloseBold
          v-if="wishlistRemoveIcon === 'close'"
          class="mr-1 h-4 w-4 lg:h-6 lg:w-6" />
        <div v-else>
          <IconHeartFull v-if="isInWishlist" :class="_class" />
          <IconHeart v-else :class="_class" />
        </div>
      </template>
    </AppButton>
  </div>
</template>

<script setup lang="ts">
import { Product } from '@scayle/storefront-nuxt'

const props = defineProps({
  product: {
    type: Object as PropType<Product>,
    required: true,
  },
  wishlistRemoveIcon: {
    type: String as PropType<'heart' | 'close'>,
    default: 'heart',
  },
})

const product = toRef(props, 'product')
const productId = computed(() => product.value.id)

const isInWishlist = false
const wishlist = { pending: false }
// const wishlist = await useCurrentWishlist()

const toggleItemInWishlist = async () => {
  // const wasInWishlist = !!wishlist.findItem({ productId: productId.value })
  // Add tracking meta
  // await wishlist.toggleItem({ productId: productId.value })
  // wishlistUtils.showWishlistToast(!wasInWishlist, product.value)
}

// const isInWishlist = computed(() => {
//   return !!wishlist.findItem({ productId: productId.value })
// })
</script>
