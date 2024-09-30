<template>
  <div
    v-if="products && products.length > 0"
    class="max-md:px-5"
    data-testid="product-promotion-gifts"
  >
    <div :style="{ ...backgroundColorStyle }" class="rounded-t-md px-3.5 py-3">
      <div class="flex items-center gap-1">
        <span class="flex h-[1.125rem] w-auto items-center justify-center">
          <IconLock v-if="!areGiftConditionsMet" class="size-3 text-white" />
          <IconGift v-else class="size-3 text-white" />
        </span>
        <SFHeadline tag="h2" size="sm" class="text-white" is-bold>
          {{ promotionGiftsHeadline }}
        </SFHeadline>
      </div>
      <p class="mt-1 text-2xs text-white">
        {{ promotionGiftsDescription }}
      </p>
    </div>
    <div class="flex flex-col divide-y rounded-b-xl border border-gray-300">
      <div v-for="(item, index) in products" :key="item.id" class="p-4">
        <ProductPromotionGiftItem
          :background-color-style="backgroundColorStyle"
          :is-product-added-to-basket="isGiftAlreadyAdded"
          :eager-image-loading="index < 2"
          :product="item"
          :promotion="promotion"
          :data-testid="`gift-item-${item.id}`"
          :disabled="!areGiftConditionsMet"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { toRef, computed } from 'vue'
import type { Product } from '@scayle/storefront-nuxt'
import ProductPromotionGiftItem from './ProductPromotionGiftItem.vue'
import { usePromotionGifts } from '~/composables'
import { SFHeadline } from '#storefront-ui/components'

const props = defineProps<{
  product: Product
  areGiftConditionsMet: boolean
  promotion: Promotion
}>()

const i18n = useI18n()

const promotionGiftsHeadline = computed(() => {
  return props.areGiftConditionsMet
    ? i18n.t('pdp.promotion.free_gift_conditions_met.headline')
    : i18n.t('pdp.promotion.free_gift_conditions_not_met.headline')
})

const promotionGiftsDescription = computed(() => {
  return props.areGiftConditionsMet
    ? i18n.t('pdp.promotion.free_gift_conditions_met.description')
    : i18n.t('pdp.promotion.free_gift_conditions_not_met.description')
})

const { backgroundColorStyle, products, isGiftAlreadyAdded } =
  usePromotionGifts(
    props.product,
    toRef(props.promotion),
    'product-promotion-gifts',
  )
</script>
