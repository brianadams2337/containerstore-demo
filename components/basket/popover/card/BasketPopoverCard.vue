<template>
  <div
    class="relative m-3 flex flex-col rounded border p-3 text-primary hover:bg-secondary-450"
  >
    <SFLink
      v-if="mainItem"
      :to="getProductDetailRoute(mainItem.product)"
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
import { type BasketItem } from '@scayle/storefront-nuxt'

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
const { isSoldOut } = await useBasketItem(mainItem)

const addOnItems = computed(() =>
  props.items.filter((item) => item.itemGroup && !item.itemGroup.isMainItem),
)
</script>
