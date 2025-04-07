<template>
  <div class="rounded-xl border">
    <div
      class="mb-3 rounded-xl px-5 py-3"
      :style="{
        ...colorStyle,
        stroke: colorStyle.color,
      }"
    >
      <div class="flex gap-1">
        <IconGift class="size-4" />
        <SFHeadline tag="h2" size="base" is-bold data-testid="headline">
          {{ promotionGiftsHeadline }}
        </SFHeadline>
      </div>

      <p class="mt-1 text-sm">
        {{ promotionGiftsDescription }}
      </p>
    </div>
    <div class="flex flex-col">
      <div v-for="(item, index) in products" :key="item.id">
        <SFProductPromotionGiftItem
          :color-style="colorStyle"
          :eager-image-loading="index < 2"
          :product="item"
          :promotion="promotion"
          :data-testid="`gift-item-${item.id}`"
          :disabled="!areGiftConditionsMet || item.isSoldOut"
          :class="{ 'border-t': index !== 0 }"
          @select-gift="onSelectGift"
        />
      </div>
    </div>
    <SFProductPromotionSelectionModal
      :visible="isModalOpen"
      :product="giftProduct"
      :promotion="promotion"
      :color-style="colorStyle"
      @update:visible="onSelectionModalVisibilityChange"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, nextTick } from 'vue'
import type { Product, Promotion } from '@scayle/storefront-nuxt'
import SFProductPromotionSelectionModal from '../SFProductPromotionSelectionModal.vue'
import SFProductPromotionGiftItem from './SFProductPromotionGiftItems.vue'
import { useI18n } from '#imports'
import { SFHeadline } from '#storefront-ui/components'
import { IconGift } from '#components'
import { usePromotionGifts } from '#storefront-promotions/composables'
import { usePromotionCustomData } from '~/composables'

const { areGiftConditionsMet, promotion } = defineProps<{
  areGiftConditionsMet: boolean
  promotion: Promotion
}>()
const { t } = useI18n()

const giftProduct = ref<Product>()
const isModalOpen = ref(false)

const onSelectGift = async (gift: Product) => {
  giftProduct.value = gift
  // wait until the next tick to avoid showing an previous gift initially
  await nextTick()
  isModalOpen.value = true
}
const onSelectionModalVisibilityChange = (isVisible: boolean) => {
  isModalOpen.value = isVisible
}

const promotionGiftsHeadline = computed(() => {
  return areGiftConditionsMet
    ? t('pdp.promotion.free_gift_conditions_met.headline')
    : t('pdp.promotion.free_gift_conditions_not_met.headline')
})

const promotionGiftsDescription = computed(() => {
  return areGiftConditionsMet
    ? t('pdp.promotion.free_gift_conditions_met.description')
    : t('pdp.promotion.free_gift_conditions_not_met.description')
})

const { products } = usePromotionGifts(promotion, 'product-promotion-gifts')
const { colorStyle } = usePromotionCustomData(promotion)
</script>
