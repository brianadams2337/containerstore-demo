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
import type { BasketItem } from '@scayle/storefront-nuxt'

const groupIds = computed(() => Object.keys(basketItems.value.groups))

const { items } = await useBasket()
const { bundleByGroup } = await useBasketGroup()

const basketItems = computed(() => {
  const data = getPartitionedBasketItems(items.value)
  return {
    standAlone: sortBasketItemsByIsSoldOut(data.standAlone),
    groups: bundleByGroup(sortBasketItemsByIsSoldOut(data.groupedItems)),
  }
})

const getBasketItemsFromGroup = (groupId: string) => {
  return basketItems.value.groups[groupId] as BasketItem[]
}
</script>
