<template>
  <div
    v-if="label"
    data-testid="product-card-footer-badges"
    class="flex h-5 w-full items-center justify-center px-1 text-2xs font-bold leading-none text-white"
    :style="style"
  >
    <span class="overflow-hidden truncate">
      {{ label }}
    </span>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { BasketItem } from '@scayle/storefront-nuxt'
import { useProductPromotions } from '~/composables'
import { getBackgroundColorStyle, isFreeGiftBasketItem } from '~/utils'
import { useI18n } from '#imports'

const { basketItem } = defineProps<{ basketItem: BasketItem }>()
const { promotion } = useProductPromotions(basketItem.product)

const isFreeGift = computed(() => isFreeGiftBasketItem(basketItem))

const i18n = useI18n()
const label = computed(() => {
  if (isFreeGift.value) {
    return i18n.t('pdp.promotion.free_label')
  }
  return promotion.value?.customData?.product?.badgeLabel
})
const style = getBackgroundColorStyle(
  basketItem.promotion?.customData?.colorHex ||
    promotion.value?.customData.colorHex,
)
</script>
