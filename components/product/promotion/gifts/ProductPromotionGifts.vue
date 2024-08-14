<template>
  <div data-testid="product-promotion-gifts">
    <div :style="backgroundColorStyle" class="rounded-t-md px-3.5 py-3">
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
    <div class="rounded-b-md border border-gray-350 bg-white pt-4">
      <div class="max-h-72 overflow-y-scroll px-3.5" @scroll="onScroll">
        <ProductPromotionGiftItem
          v-for="(item, index) in products"
          :key="item.id"
          v-bind="{ backgroundColorStyle, isProductAddedToBasket }"
          :eager-image-loading="index < 2"
          :product="item"
          class="mb-4 last-of-type:mb-0"
          :data-testid="`gift-item-${item.id}`"
        />
      </div>
      <div
        class="relative z-20 mt-4 px-4 py-2 text-center"
        :class="shadowClass"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import type { Product } from '@scayle/storefront-nuxt'
import { isScrolledToBottom } from '~/utils/scroll'
import { useProductPromotions, usePromotionGifts } from '~/composables'
import { useI18n } from '#i18n'

const i18n = useI18n()
const props = defineProps<{ product: Product }>()

const { isProductAddedToBasket, areGiftConditionsMet } = useProductPromotions(
  props.product,
)

const { backgroundColorStyle, products, hasMultipleFreeGifts } =
  usePromotionGifts(props.product, 'product-promotion-gifts.vue')

const hasScrolledToBottom = ref(false)

const onScroll = (element: Event) => {
  hasScrolledToBottom.value = isScrolledToBottom(element)
}

const promotionGiftsHeadline = computed(() => {
  return areGiftConditionsMet.value
    ? i18n.t('pdp.promotion.free_gift_conditions_met.headline')
    : i18n.t('pdp.promotion.free_gift_conditions_not_met.headline')
})

const promotionGiftsDescription = computed(() => {
  return areGiftConditionsMet.value
    ? i18n.t('pdp.promotion.free_gift_conditions_met.description')
    : i18n.t('pdp.promotion.free_gift_conditions_not_met.description')
})

const shadowClass = computed(() => {
  return (
    hasMultipleFreeGifts.value &&
    !hasScrolledToBottom.value &&
    'top-white-shadow'
  )
})
</script>
