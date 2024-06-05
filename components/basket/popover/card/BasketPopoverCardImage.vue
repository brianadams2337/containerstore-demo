<template>
  <div class="relative w-20 flex-none shrink-0 rounded-md bg-gray-200 p-2">
    <ProductImage
      v-if="image"
      :image="image"
      :alt="name"
      fit="cover"
      height="144"
      sizes="xl:100vw lg:100vw lg:100vw lg:100vw xs:100vw"
    />
    <ProductPromotionFreeGiftBadge
      v-if="isFreeGift"
      v-bind="{ backgroundColorStyle }"
      class="absolute bottom-2 left-2"
    />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { type BasketItem } from '@scayle/storefront-nuxt'
import { useBasketItem, useBasketItemPromotion } from '~/composables'

const props = defineProps<{ item: BasketItem }>()

const basketItem = computed(() => props.item)

const { image, name } = await useBasketItem(basketItem)

const { isFreeGift, backgroundColorStyle } =
  await useBasketItemPromotion(basketItem)
</script>
