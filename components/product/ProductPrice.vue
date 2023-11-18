<template>
  <div>
    <slot v-bind="{ price, appliedReductions }">
      <slot name="relative-reductions">
        <span
          v-if="showBadge && totalReductions"
          class="inline-block rounded-md bg-red-500 px-2 py-1 text-sm text-white"
        >
          -{{ totalReductions.relative * 100 }}%
        </span>
      </slot>
      <p class="leading-snug" :class="classes" data-test-id="price">
        <template v-if="showPriceFrom">
          {{ $t('price.starting_from') }}
        </template>
        {{ toCurrency(price.withTax) }}
        <span
          v-if="totalReductions.absoluteWithTax"
          class="text-sm font-medium text-primary line-through"
          data-test-id="initialProductPrice"
        >
          {{ toCurrency(price.withTax + totalReductions.absoluteWithTax) }}
        </span>
      </p>
      <slot name="tax-info">
        <div
          v-if="showTaxInfo"
          class="text-right text-xs text-gray-700 md:text-left"
        >
          {{ $t('price.including_vat') }}
        </div>
      </slot>
      <p
        v-if="appliedReductions.length && hasLowestPriorPrice"
        class="mt-0.5 text-sm text-gray-700"
      >
        {{ $t('price.best_price_30d') }}
        {{ toCurrency(lowestPriorPrice.withTax ?? 0) }}
        ({{ (lowestPriorPrice.relativeDifferenceToPrice ?? 0) * 100 }}%)
      </p>
    </slot>
  </div>
</template>

<script setup lang="ts">
import {
  type Price,
  type LowestPriorPrice,
  type AppliedReduction,
  getTotalAppliedReductions,
} from '@scayle/storefront-nuxt'
import { Size } from '#imports'

type Props = {
  price: Price
  appliedReductions?: AppliedReduction[]
  lowestPriorPrice?: LowestPriorPrice
  showTaxInfo?: boolean
  showPriceFrom?: boolean
  showPriceReductionBadge?: boolean
  size?: Size
  type?: 'normal' | 'whisper' | 'loud'
}

const props = withDefaults(defineProps<Props>(), {
  appliedReductions: () => [],
  lowestPriorPrice: () => ({
    withTax: null,
    relativeDifferenceToPrice: null,
  }),
  showTaxInfo: false,
  showPriceFrom: false,
  showPriceReductionBadge: false,
  size: Size.XL,
  type: 'loud',
})

const totalReductions = computed(() => getTotalAppliedReductions(props.price))

const showBadge = computed(() => {
  return props.appliedReductions && props.showPriceReductionBadge
})

const hasLowestPriorPrice = computed(() => {
  return (
    props.lowestPriorPrice?.withTax &&
    props.lowestPriorPrice?.relativeDifferenceToPrice
  )
})

const classes = computed(() => ({
  'mt-2': showBadge.value,
  'text-xl': props.size === Size.XL,
  'text-lg': props.size === Size.LG,
  'text-sm': props.size === Size.SM,
  'text-md': props.size === Size.MD,
  'text-xs': props.size === Size.XS,
  'font-bold': props.type === 'loud',
  'font-semibold': props.type === 'whisper',
  'text-red-500': props.appliedReductions.length,
}))
</script>
