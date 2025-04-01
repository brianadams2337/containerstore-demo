<template>
  <!-- eslint-disable unimport/auto-insert-->
  <!-- Disabling unimport/auto-insert here due misdetection of min keyword -->
  <div>
    <!--
      `silent` switches off error messages
      Setting min/max at the same time as setting range causes errors.
      This error causes no issues.
      Source: https://github.com/NightCatSama/vue-slider-component/issues/343#issuecomment-482508771-->
    <ClientOnly>
      <VueSlider
        :model-value="range"
        :enable-cross="false"
        :min="roundDownPrice(min)"
        :max="roundUpPrice(max)"
        contained
        adsorb
        drag-on-click
        silent
        :interval="10 ** decimalPlaces"
        height="2px"
        tooltip="always"
        tooltip-placement="top"
        :dot-attrs="{ 'aria-label': $t('filter.update_price') }"
        @update:model-value="updateRange"
        @drag-start="emit('dragStart', range)"
        @drag-end="emit('dragEnd', range)"
        @dragging="emit('dragging')"
        @error="emit('error')"
      >
        <template #dot>
          <button
            tabindex="-1"
            class="flex size-4 cursor-pointer rounded-full bg-primary focus:outline-none"
          >
            <span class="m-auto size-3 rounded-full bg-white" />
          </button>
        </template>
        <template #tooltip="{ value }">
          <div class="rounded bg-gray-200 p-1 text-sm text-gray-600">
            {{ formatCurrency(value) }}
          </div>
        </template>
      </VueSlider>
    </ClientOnly>
    <div class="mt-4 flex items-center">
      <SFPriceInput
        :model-value="range[0]"
        :min="roundDownPrice(min)"
        :max="range[1]"
        :currency-code="currencyCode"
        :locale="locale"
        :format-options="{
          minimumFractionDigits: 0,
        }"
        :aria-label="
          $t('filter.minimum_price', {
            price: formatCurrency(range[0]),
          })
        "
        @update:model-value="changeRangeAtIndex(roundDownPrice($event), 0)"
        @change="emit('inputFieldUpdate', range)"
      />
      <div class="mx-auto text-center text-xs font-semibold text-secondary">
        {{ $t('filter.to') }}
      </div>
      <SFPriceInput
        :model-value="range[1]"
        :min="range[0]"
        :max="roundUpPrice(max)"
        :currency-code="currencyCode"
        :locale="locale"
        :format-options="{
          minimumFractionDigits: 0,
        }"
        :aria-label="
          $t('filter.maximum_price', {
            price: formatCurrency(range[1]),
          })
        "
        @update:model-value="changeRangeAtIndex(roundUpPrice($event), 1)"
        @change="emit('inputFieldUpdate', range)"
      />
    </div>
  </div>
  <!-- eslint-enable unimport/auto-insert-->
</template>

<script setup lang="ts">
import { computed } from 'vue'
// By default vue-slider-component does not support SSR.
// We can work around this by importing js and styles separately
// https://nightcatsama.github.io/vue-slider-component/#/?hash=server-side-rendering-ssr
// @ts-expect-error Could not find a declaration file for module 'vue-slider-component/dist-css/vue-slider-component.umd.min.js'. '(...)' implicitly has an 'any' type.
import VueSlider from 'vue-slider-component/dist-css/vue-slider-component.umd.min.js'
import 'vue-slider-component/dist-css/vue-slider-component.css'
import '@/assets/css/slider/default.css'
import type { RangeTuple } from '@scayle/storefront-product-listing'
import { useCurrentShop } from '#storefront/composables'
import { SFPriceInput } from '#storefront-ui/components'
import {
  getDecimalPlacesForCurrency,
  roundDown,
  roundUp,
} from '#storefront-ui/helpers/utils'
import { ClientOnly } from '#components'

const { min = 0, max = 100000 } = defineProps<{
  min?: number
  max?: number
}>()

const range = defineModel<RangeTuple>({
  required: true,
  set([min, max]) {
    return [roundDownPrice(min), roundUpPrice(max)]
  },
  get([min, max]) {
    return [roundDownPrice(min), roundUpPrice(max)]
  },
})

const currentShop = useCurrentShop()
const locale = currentShop.value!.locale
const currencyCode = currentShop.value!.currency

const emit = defineEmits<{
  dragging: []
  error: []
  dragEnd: [range: RangeTuple]
  dragStart: [range: RangeTuple]
  inputFieldUpdate: [range: RangeTuple]
}>()

const changeRangeAtIndex = (newRangeValue: number, index: 0 | 1) => {
  const updatedRange = [...range.value]
  updatedRange[index] = newRangeValue
  range.value = updatedRange as RangeTuple
}

const updateRange = (newRange: RangeTuple) => {
  range.value = newRange
}

/**
 * Price calculations:
 *
 * Prices are stored as integers in the minor unit of a currency (e.g. cents).
 *
 * In order to convert between the minor unit and major unit we need to know how many decimal places or how many minor units per major unit.
 * In most cases this is 2. There are 100 cents to a Euro, so conversions are dividing or multiplying by 100. But since this is not always
 * the case we determine the number of decimal places using the Intl.NumberFormat API then divide or multiple by 10^decimalPlaces (or`10 ** decimalPlaces` in JS).
 * We do not handle currencies which use non-decimal fractions.
 */

const decimalPlaces = computed(() => {
  if (!currencyCode) {
    return 2
  }

  return getDecimalPlacesForCurrency(currencyCode)
})

/**
 * Round the price down to a whole value
 * @param price
 */
const roundDownPrice = (price: number) => {
  return roundDown(price, 10 ** decimalPlaces.value)
}

/**
 * Round the price up to a whole value
 * @param price
 */
const roundUpPrice = (price: number) => {
  return roundUp(price, 10 ** decimalPlaces.value)
}

const formatCurrency = (value: number): string => {
  return (value / 10 ** decimalPlaces.value).toLocaleString(locale, {
    style: 'currency',
    currency: currencyCode,
    minimumFractionDigits: 0,
  })
}
</script>
