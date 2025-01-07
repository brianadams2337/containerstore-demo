<template>
  <SFButton
    v-bind="$attrs"
    size="md"
    variant="raw"
    class="rounded-md border-none bg-transparent !text-gray-400 transition duration-150 ease-in-out hover:scale-110 hover:bg-gray-200"
    :data-testid="
      isInWishlist
        ? 'remove-item-from-wishlist-button'
        : 'add-item-to-wishlist-button'
    "
    :loading="mounted && status === 'pending'"
    :aria-label="
      isInWishlist
        ? $t('wishlist.toggle.remove_from_wishlist_label')
        : $t('wishlist.toggle.add_to_wishlist_label')
    "
    :aria-busy="mounted && status === 'pending'"
    aria-live="off"
    :aria-disabled="isWishlistToggling"
    @click="onToggleWishlist"
  >
    <template #icon="{ _class }">
      <SFAsyncDataWrapper :status="wishlistStatus">
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
      </SFAsyncDataWrapper>
    </template>
  </SFButton>
</template>

<script setup lang="ts">
import { computed, defineOptions, ref, toRef } from 'vue'
import type { Product } from '@scayle/storefront-nuxt'
import { useMounted } from '@vueuse/core'
import SFAsyncDataWrapper from '../SFAsyncDataWrapper.vue'
import { useWishlistTracking } from '~/composables'
import { useWishlist } from '#storefront/composables'
import { SFButton } from '#storefront-ui/components'
import type { ListItem } from '~/types/tracking'

type Props = {
  product: Product
  listingMetaData?: ListItem
}

const props = withDefaults(defineProps<Props>(), { listingMetaData: undefined })

defineOptions({ inheritAttrs: false })

const mounted = useMounted()
const isWishlistToggling = ref(false)
const product = toRef(props, 'product')
const productId = computed(() => product.value.id)

const { toggleItem, contains, status } = useWishlist()

const { trackWishlistItemEvent } = useWishlistTracking()

const onToggleWishlist = async () => {
  if (isWishlistToggling.value) {
    return
  }

  const wasInWishlist = contains({ productId: productId.value })

  trackWishlistItemEvent(!wasInWishlist ? 'added' : 'removed', {
    product: product.value,
    ...(props.listingMetaData && { listingMetaData: props.listingMetaData }),
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
