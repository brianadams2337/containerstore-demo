<template>
  <div
    class="absolute left-auto right-0 top-0 z-10 flex h-8 w-auto cursor-pointer p-1 md:p-3">
    <AppButton
      :key="`item-${product.id}-is-in-wishlist-${isInWishlist}`"
      :data-test-id="
        isInWishlist
          ? 'product-card-action-remove-item-from-wishlist-button'
          : 'product-card-action-add-item-to-wishlist-button'
      "
      :loading="fetching"
      class="opacity-50"
      type="ghost"
      @click="toggleItemInWishlist">
      <template #icon="{ _class }">
        <SvgoUiCloseBold
          v-if="wishlistRemoveIcon === 'close'"
          class="mr-1 h-4 w-4 lg:h-6 lg:w-6" />
        <div v-else>
          <SvgoUiHeartFull v-if="isInWishlist" :class="_class" />
          <SvgoUiHeart v-else :class="_class" />
        </div>
      </template>
    </AppButton>
  </div>
</template>

<script setup lang="ts">
import { Product } from '@scayle/storefront-nuxt'

// TODO move interface to types
interface ListItem {
  name: string
  id: string
  index?: number | undefined
}
const props = defineProps({
  product: {
    type: Object as PropType<Product>,
    required: true,
  },
  wishlistRemoveIcon: {
    type: String as PropType<'heart' | 'close'>,
    default: () => 'heart',
  },
  listingMetaData: {
    type: Object as PropType<ListItem>,
    default: () => {},
  },
})

const product = toRef(props, 'product')
const productId = computed(() => product.value.id)

// TODO enable once wishlist composable is ready
// const wishlist = useWishlist()
// const wishlistUtils = useWishlistUtils()

const toggleItemInWishlist = async () => {
  // const wasInWishlist = !!wishlist.findItem({ productId: productId.value })
  // wishlistUtils.trackWishlistEvent(!wasInWishlist ? 'added' : 'removed', {
  //   product: product.value,
  //   listingMetaData: props.listingMetaData,
  // })
  // await wishlist.toggleItem({ productId: productId.value })
  // wishlistUtils.showWishlistToast(!wasInWishlist, product.value)
}

// const isInWishlist = computed(
//   () => !!wishlist.findItem({ productId: productId.value }),
// )

// const fetching = computed(() => wishlist.fetching.value)

const isInWishlist = ref(false)
const fetching = ref(false)
</script>
