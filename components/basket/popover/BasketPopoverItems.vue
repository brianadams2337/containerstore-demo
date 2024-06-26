<template>
  <div
    v-if="basketItems?.standAlone?.length"
    class="max-h-xs overflow-y-auto overscroll-none"
  >
    <article v-for="item in basketItems?.standAlone" :key="item.key">
      <BasketPopoverCard :items="[item]" is-light-variant />
    </article>
  </div>
  <div v-if="groupIds?.length" class="max-h-xs overflow-y-auto overscroll-none">
    <article v-for="groupId in groupIds" :key="groupId">
      <BasketPopoverCard
        :items="getBasketItemsFromGroup(groupId)"
        is-light-variant
      />
    </article>
  </div>
  <div
    v-if="!items?.length"
    class="flex w-full flex-col items-center justify-center py-4"
  >
    <div class="w-2/3">
      <p class="text-center text-sm">
        {{ $t('basket.no_items_info') }}
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watchPostEffect } from 'vue'
import type { BasketItem } from '@scayle/storefront-nuxt'
import {
  bundleBasketItemsByGroup,
  getPartitionedBasketItems,
  sortBasketItemsByIsSoldOut,
} from '~/utils/basket'
import { useBasket } from '#storefront/composables'
import type { BundledBasketItems } from '~/utils/basket'

type BasketItems = {
  standAlone: BasketItem[]
  groups: BundledBasketItems<BasketItem>
}

const { items } = useBasket()

const basketItems = ref<BasketItems>({
  standAlone: [],
  groups: {},
})

const groupIds = computed(() => Object.keys(basketItems.value.groups))

const updateBasketItems = (items: BasketItem[]) => {
  const data = getPartitionedBasketItems(items)
  return {
    standAlone: sortBasketItemsByIsSoldOut(data.standAlone),
    groups: bundleBasketItemsByGroup(
      sortBasketItemsByIsSoldOut(data.groupedItems),
    ),
  }
}

// TODO: Investigate why when using computed for basket items instead is causing
// UI issues (items with promotion on it, are not visible in the list.
// After refresh they show up)
watchPostEffect(() => {
  basketItems.value = updateBasketItems(items.value ?? [])
})

const getBasketItemsFromGroup = (groupId: string) => {
  return basketItems.value.groups[groupId] as BasketItem[]
}
</script>
