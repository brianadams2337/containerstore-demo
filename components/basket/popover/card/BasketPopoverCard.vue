<template>
  <div
    class="relative m-3 flex flex-col rounded border p-3 text-primary hover:bg-secondary-450"
  >
    <SFLink
      v-if="mainItem"
      :to="getProductDetailRoute(mainItem.product.id, name)"
      class="flex text-sm"
      :class="{ 'opacity-40': isSoldOut }"
    >
      <div class="mr-5 flex flex-1">
        <BasketPopoverCardImage :item="mainItem" />
        <BasketPopoverCardBaseInfo
          :item="mainItem"
          :is-light-variant="isLightVariant"
          class="ml-2"
        />
      </div>
      <BasketPopoverCardPrice :item="mainItem" />
    </SFLink>
    <AddOnItems
      v-if="addOnItems.length"
      :items="addOnItems"
      class="mt-3"
      size-mode="sm"
    />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { BasketItem } from '@scayle/storefront-nuxt'
import AddOnItems from '../../addOns/AddOnItems.vue'
import BasketPopoverCardImage from './BasketPopoverCardImage.vue'
import BasketPopoverCardBaseInfo from './BasketPopoverCardBaseInfo.vue'
import BasketPopoverCardPrice from './BasketPopoverCardPrice.vue'
import { SFLink } from '#storefront-ui/components'
import { useBasketItem, useRouteHelpers } from '~/composables'

type Props = {
  items: BasketItem[]
  isOnWishlist?: boolean
  hasBasketAction?: boolean
  hasWishlistAction?: boolean
  hasQuantityAction?: boolean
  isLightVariant?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  isOnWishlist: false,
  hasBasketAction: false,
  hasWishlistAction: false,
  hasQuantityAction: false,
  isLightVariant: false,
})

const mainItem = computed(() => {
  const basketItem =
    props.items.length === 1
      ? props.items[0]
      : props.items.find((item) => item.itemGroup?.isMainItem)

  return basketItem as BasketItem
})
const { getProductDetailRoute } = useRouteHelpers()
const { isSoldOut, name } = useBasketItem(mainItem)

const addOnItems = computed(() =>
  props.items.filter((item) => item.itemGroup && !item.itemGroup.isMainItem),
)
</script>
