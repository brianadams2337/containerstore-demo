<template>
  <div class="flex flex-wrap items-center gap-1">
    <span
      v-for="({ value, category }, index) in relativeReductions"
      :key="`${value}-badge-${category}-${index}`"
      class="mr-1 inline-block rounded bg-red px-1 text-xs font-semibold text-white"
      :style="category === 'promotion' && promotionStyle"
    >
      -{{ value }}%
    </span>

    <p class="text-gray-900" :class="classes" data-testid="price">
      <template v-if="showPriceFrom">
        {{ $t('price.starting_from') }}
      </template>
      {{ totalPrice }}
      <span
        v-for="(reduction, index) in strikeThroughPrices"
        :key="`${reduction}-${index}`"
        class="mr-1 font-normal text-gray-600 line-through last-of-type:mr-0"
        data-testid="initialProductPrice"
      >
        {{ reduction }}
      </span>
    </p>

    <div
      v-if="showTaxInfo"
      class="ml-1 text-right text-xs text-gray-700 md:text-left"
    >
      {{ $t('price.including_vat') }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, toRefs } from 'vue'
import type { Price, Promotion } from '@scayle/storefront-nuxt'
import { Size } from '#storefront-ui'
import { useProductPrice } from '~/composables/useProductPrice'
import { getPromotionStyle } from '~/utils'

type Props = {
  price: Price
  promotion?: Promotion | null
  showTaxInfo?: boolean
  showPriceFrom?: boolean
  showBadges?: boolean
  size?: Size
  type?: 'normal' | 'whisper' | 'loud'
}

const props = withDefaults(defineProps<Props>(), {
  showTaxInfo: false,
  showPriceFrom: false,
  showBadges: true,
  size: Size.MD,
  type: 'normal',
  promotion: undefined,
})

const { price } = toRefs(props)
const {
  appliedReductions,
  strikeThroughPrices,
  relativeReductions,
  totalPrice,
} = useProductPrice(price)

const promotionStyle = computed(() => getPromotionStyle(props.promotion))

const classes = computed(() => ({
  'text-xl': props.size === Size.XL,
  'text-lg': props.size === Size.LG,
  'text-sm': props.size === Size.SM,
  'text-base': props.size === Size.MD,
  'text-xs': props.size === Size.XS,
  'font-bold': props.type === 'loud',
  'font-semibold': props.type === 'whisper',
  'font-variable': props.type === 'normal',
  'text-status-error': appliedReductions.value.length,
}))
</script>
