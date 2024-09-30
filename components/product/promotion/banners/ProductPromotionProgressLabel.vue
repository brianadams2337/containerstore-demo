<template>
  <div v-if="minOrderAmount" class="flex w-full flex-col items-start">
    <SFProgressBar
      class="mb-2 mt-3"
      :progress="progress"
      rounded
      slanted
      type="neutral"
      background-color="bg-white/20"
    />
    <p class="w-full text-center text-xs font-semibold">
      <template v-if="!isFullProgress">
        {{ $t('promotion.progress_left', { amount: formattedAmountLeft }) }}
      </template>
      <template v-else>
        🎉
        <template
          v-if="
            isMOVPromotionApplied &&
            ((isBuyXGetY && areGiftConditionsMet) || isAutomaticDiscount)
          "
        >
          {{
            $t('pdp.promotion.full_progress_message', {
              amount: formattedDiscount,
            })
          }}
        </template>
        <template v-else-if="isAutomaticDiscount">
          {{
            $t('pdp.promotion.cart_reached', { discount: automaticDiscount })
          }}
        </template>
        <template v-else-if="isBuyXGetY">
          {{
            $t(
              !isGiftAddedToBasket && areGiftConditionsMet
                ? 'pdp.promotion.add_free_gift_when_cart_reached'
                : 'pdp.promotion.cart_reached_for_gifts',
            )
          }}
        </template>
      </template>
    </p>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import {
  getAdditionalData,
  isAutomaticDiscountType,
  isBuyXGetYType,
} from '~/utils/promotion'
import { SFProgressBar } from '#storefront-ui/components'

type Props = {
  promotion: Promotion
  isGiftAddedToBasket?: boolean
  areGiftConditionsMet?: boolean
  progress: number
  minOrderAmount: number
  isMOVPromotionApplied: boolean
  isFullProgress: boolean
  formattedDiscount?: string
  formattedAmountLeft?: string
}

const props = withDefaults(defineProps<Props>(), {
  isGiftAddedToBasket: false,
  areGiftConditionsMet: false,
  formattedDiscount: '',
  formattedAmountLeft: '',
})

const isAutomaticDiscount = computed(() =>
  isAutomaticDiscountType(props.promotion),
)

const isBuyXGetY = computed(() => isBuyXGetYType(props.promotion))

const automaticDiscount = computed(() => {
  return getAdditionalData(props.promotion)?.value
})
</script>
