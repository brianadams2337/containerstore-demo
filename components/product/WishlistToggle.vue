<template>
  <div class="relative">
    <AppButton
      v-bind="$attrs"
      class="opacity-50"
      no-padding
      type="ghost"
      :data-test-id="
        isInWishlist
          ? 'remove-item-from-wishlist-button'
          : 'add-item-to-wishlist-button'
      "
      :loading="fetching"
      :aria-label="
        isInWishlist
          ? $t('basket_card.remove_from_wishlist_label')
          : $t('basket_card.add_to_wishlist_label')
      "
      @click="onToggleWishlist">
      <template #icon="{ _class }">
        <IconHeartFull v-if="isInWishlist" :class="_class" />
        <IconHeart v-else :class="_class" />
      </template>
    </AppButton>
    <div
      v-if="tooltipVisible"
      data-test-id="wishlist-toggle-tooltip"
      class="absolute right-full top-0 z-20 whitespace-nowrap rounded border border-black bg-white px-3 py-1 text-base before:absolute before:left-full before:top-1/2 before:mt-[-6px] before:border-[6px] before:border-transparent before:border-l-black after:absolute after:left-full after:top-1/2 after:mt-[-5px] after:border-[5px] after:border-transparent after:border-l-white">
      {{
        isInWishlist
          ? $t('wishlist.notification.added_to_wishlist')
          : $t('wishlist.notification.removed_from_wishlist')
      }}
    </div>
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
  listingMetaData: {
    type: Object as PropType<ListItem>,
    default: () => ({}),
  },
})

defineOptions({
  inheritAttrs: false,
})

const tooltipVisible = ref(false)
const isWishlistToggling = ref(false)
const product = toRef(props, 'product')
const productId = computed(() => product.value.id)

const { toggleItem, fetching, contains, fetch } = await useWishlist({
  options: { autoFetch: false },
})

onMounted(() => {
  fetch()
})

const onToggleWishlist = async () => {
  const wasInWishlist = contains({ productId: productId.value })

  trackWishlistEvent(wasInWishlist ? 'added' : 'removed', {
    product: product.value,
    listingMetaData: props.listingMetaData,
  })

  isWishlistToggling.value = true
  await toggleItem({ productId: productId.value })
  isWishlistToggling.value = false

  tooltipVisible.value = true
  setTimeout(() => (tooltipVisible.value = false), 3000)
}

const isInWishlist = computed(() => {
  return contains({ productId: productId.value })
})
</script>
