<template>
  <SFButton
    v-bind="$attrs"
    size="md"
    variant="raw"
    class="rounded-md border-none bg-transparent !text-gray-500 transition duration-150 ease-in-out hover:scale-110 hover:bg-gray-200"
    :data-testid="
      isInWishlist
        ? 'remove-item-from-wishlist-button'
        : 'add-item-to-wishlist-button'
    "
    :loading="mounted && status === 'pending'"
    :aria-label="
      isInWishlist
        ? $t('wishlist_toggle.remove_from_wishlist')
        : $t('wishlist_toggle.add_to_wishlist')
    "
    :aria-busy="mounted && status === 'pending'"
    aria-live="off"
    :aria-disabled="isWishlistToggling"
    @click="onToggleWishlist"
  >
    <template #icon="{ _class }">
      <SFAsyncStatusWrapper :status="wishlistStatus">
        <IconHeartInactive
          v-if="
            (!isInWishlist && !isWishlistToggling) ||
            (isInWishlist && isWishlistToggling)
          "
          :class="_class"
        />
        <IconHeartActivePurple v-else :class="_class" />
        <template #loading>
          <IconHeartInactive
            :class="_class"
            class="animate-pulse fill-gray-200 text-gray-200"
          />
        </template>
      </SFAsyncStatusWrapper>
    </template>
  </SFButton>
</template>

<script setup lang="ts">
import { computed, defineOptions, ref } from 'vue'
import type { Product } from '@scayle/storefront-nuxt'
import { useMounted } from '@vueuse/core'
import SFAsyncStatusWrapper from '../SFAsyncStatusWrapper.vue'
import { useWishlistTracking } from '~/composables'
import { useWishlist } from '#storefront/composables'
import { SFButton } from '#storefront-ui/components'
import type { ListItem } from '~/types/tracking'

const { product, listingMetaData } = defineProps<{
  product: Product
  listingMetaData?: ListItem
}>()

defineOptions({ inheritAttrs: false })

const mounted = useMounted()
const isWishlistToggling = ref(false)

const productId = computed(() => product.id)

const { toggleItem, contains, status } = useWishlist()

const { trackWishlistItemEvent } = useWishlistTracking()

const onToggleWishlist = async () => {
  if (isWishlistToggling.value) {
    return
  }

  const wasInWishlist = contains({ productId: productId.value })

  trackWishlistItemEvent(!wasInWishlist ? 'added' : 'removed', {
    product,
    ...(listingMetaData && { listingMetaData }),
  })

  isWishlistToggling.value = true
  await toggleItem({ productId: productId.value })
  isWishlistToggling.value = false
}

const isInWishlist = computed(() => {
  return contains({ productId: productId.value })
})

const wishlistStatus = computed(() => {
  return mounted.value ? status.value : 'pending'
})
</script>
