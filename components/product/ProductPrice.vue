<template>
  <div>
    <slot v-bind="{ price, appliedReductions }">
      <slot name="relative-reductions">
        <span
          v-if="showBadge && totalReductions"
          class="inline-block rounded-sm bg-red-500 px-2 py-1 text-sm text-white">
          -{{ totalReductions.relative * 100 }}%
        </span>
      </slot>
      <p
        class="leading-snug"
        :class="{
          'mt-2': showBadge,
          'text-xl': size === 'xl',
          'text-sm': size === 'sm',
          'text-xs': size === 'xs',
          'font-bold': type === 'loud',
          'font-semibold': type === 'whisper',
          'text-red-500': appliedReductions.length,
        }"
        data-test-id="price">
        <template v-if="showPriceFrom">
          {{ $t('price.starting_from') }}
        </template>
        {{ getCurrency(price.withTax) }}
        <span
          v-if="totalReductions.absoluteWithTax"
          class="text-primary text-sm font-medium line-through"
          data-test-id="initialProductPrice">
          {{ getCurrency(price.withTax + totalReductions.absoluteWithTax) }}
        </span>
      </p>
      <slot name="tax-info">
        <div
          v-if="showTaxInfo"
          class="text-right text-xs text-gray-700 md:text-left">
          {{ $t('price.including_vat') }}
        </div>
      </slot>
      <p
        v-if="appliedReductions.length && hasLowestPriorPrice"
        class="mt-0.5 text-sm text-gray-700">
        {{ $t('price.best_price_30d') }}
        {{ getCurrency(lowestPriorPrice.withTax ?? 0) }}
        ({{ (lowestPriorPrice.relativeDifferenceToPrice ?? 0) * 100 }}%)
      </p>
    </slot>
  </div>
</template>

<script setup lang="ts">
import {
  getTotalAppliedReductions,
  Price,
  LowestPriorPrice,
  AppliedReduction,
} from '@scayle/storefront-nuxt'

const props = defineProps({
  appliedReductions: {
    type: Array as PropType<AppliedReduction[]>,
    default: () => [],
  },
  price: {
    type: Object as PropType<Price>,
    required: true,
  },
  lowestPriorPrice: {
    type: Object as PropType<LowestPriorPrice>,
    default: () => ({
      withTax: null,
      relativeDifferenceToPrice: null,
    }),
  },
  showTaxInfo: {
    type: Boolean as PropType<boolean>,
    default: false,
  },
  showPriceFrom: {
    type: Boolean as PropType<boolean>,
    default: false,
  },
  showPriceReductionBadge: {
    type: Boolean as PropType<boolean>,
    default: false,
  },
  size: {
    type: String as PropType<'xl' | 'md' | 'sm' | 'xs'>,
    default: 'xl',
  },
  type: {
    type: String as PropType<'normal' | 'whisper' | 'loud'>,
    default: 'loud',
  },
})

const currentShop = useCurrentShop()

const getCurrency = (value: number): string => {
  if (!currentShop.value) {
    return ''
  }

  return toCurrency(
    value,
    usePick(currentShop.value, [
      'locale',
      'currency',
      'currencyFractionDigits',
    ]),
  )
}

const totalReductions = computed(() => getTotalAppliedReductions(props.price))

const showBadge = computed(
  () => props.appliedReductions && props.showPriceReductionBadge,
)
const hasLowestPriorPrice = computed(
  () =>
    props.lowestPriorPrice?.withTax &&
    props.lowestPriorPrice?.relativeDifferenceToPrice,
)
</script>
