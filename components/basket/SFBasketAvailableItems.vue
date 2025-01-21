<template>
  <ul
    class="flex w-full flex-col items-end pt-px lg:min-w-125 lg:max-w-156"
    :aria-label="$t('basket.available_products')"
  >
    <SFBasketCard
      v-for="item in availableItems"
      :key="item.key"
      :basket-item="item"
      :show-free-gift-selection="isLastItemWithPromotions(item)"
      class="-mt-px w-full focus-within:z-10"
      @update:quantity="$emit('update:quantity', item, $event)"
      @delete="$emit('delete', item)"
    />
  </ul>
</template>

<script setup lang="ts">
import {
  getFirstAttributeValue,
  type BasketItem,
} from '@scayle/storefront-nuxt'
import SFBasketCard from './SFBasketCard.vue'

const { availableItems = [] } = defineProps<{ availableItems?: BasketItem[] }>()

const isLastItemWithPromotions = (basketItem: BasketItem) => {
  const promotionId = getFirstAttributeValue(
    basketItem.product.attributes || {},
    'promotion',
  )?.id
  if (!promotionId || !availableItems.length) {
    return false
  }
  const hasSamePromotion = (item: BasketItem) =>
    getFirstAttributeValue(item.product.attributes || {}, 'promotion')?.id ===
    promotionId

  const indexOfBasketItem = availableItems?.findIndex(
    (item) => item.key === basketItem.key,
  )
  const indexOfLastItemWithSamePromotion =
    availableItems?.findLastIndex(hasSamePromotion)

  return indexOfBasketItem === indexOfLastItemWithSamePromotion
}

defineEmits<{
  (e: 'delete', item: BasketItem): void
  (e: 'update:quantity', item: BasketItem, newQuantity: number): void
}>()
</script>
