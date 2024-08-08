<template>
  <div>
    <!--
      `silent` switches off error messages
      Setting min/max at the same time as setting range causes errors.
      This error causes no issues.
      Source: https://github.com/NightCatSama/vue-slider-component/issues/343#issuecomment-482508771-->
    <ClientOnly>
      <VueSlider
        v-model="range"
        :enable-cross="false"
        :min="min"
        :max="max"
        contained
        adsorb
        drag-on-click
        silent
        height="2px"
        tooltip="always"
        tooltip-placement="top"
        @change="emit('slider-change')"
        @drag-start="emit('drag-start', range)"
        @drag-end="emit('drag-end', range)"
        @dragging="emit('dragging')"
        @error="emit('error')"
      >
        <template #dot>
          <button
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
        :min="min"
        :max="modelValue[1]"
        :currency-code="currencyCode"
        :locale="locale"
        :format-options="{
          minimumFractionDigits: 0,
        }"
        @update:model-value="changeRangeAtIndex($event, 0)"
      />
      <div class="mx-auto text-center text-xs font-semibold text-secondary">
        {{ $t('filter.to') }}
      </div>
      <SFPriceInput
        :model-value="range[1]"
        :min="modelValue[0]"
        :max="max"
        :currency-code="currencyCode"
        :locale="locale"
        :format-options="{
          minimumFractionDigits: 0,
        }"
        @update:model-value="changeRangeAtIndex($event, 1)"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, defineModel } from 'vue'
// By default vue-slider-component does not support SSR.
// We can work around this by importing js and styles separately
// https://nightcatsama.github.io/vue-slider-component/#/?hash=server-side-rendering-ssr
// @ts-expect-error Could not find a declaration file for module 'vue-slider-component/dist-css/vue-slider-component.umd.min.js'. '(...)' implicitly has an 'any' type.
import VueSlider from 'vue-slider-component/dist-css/vue-slider-component.umd.min.js'
import 'vue-slider-component/dist-css/vue-slider-component.css'
import '@/assets/css/slider/default.css'
import { useCurrentShop } from '#storefront/composables'

export type RangeTuple = [start: number, end: number]

type Props = {
  min?: number
  max?: number
}

withDefaults(defineProps<Props>(), {
  min: 0,
  max: 100000,
})

const range = defineModel<RangeTuple>({
  required: true,
})

const currentShop = useCurrentShop()
const locale = currentShop.value!.locale
const currencyCode = currentShop.value!.currency

const emit = defineEmits<{
  (e: 'change' | 'slider-change' | 'dragging' | 'error'): void
  (e: 'drag-end' | 'drag-start' | 'change', activePrice: RangeTuple): void
}>()

const changeRangeAtIndex = (newRangeValue: number, index: 0 | 1) => {
  const updatedRange = [...range.value]
  updatedRange[index] = newRangeValue
  range.value = updatedRange as RangeTuple
  emit('change', range.value)
}

const decimalPlaces = computed(() => {
  if (!currencyCode) {
    return 2
  }

  const parts = new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currencyCode,
  }).formatToParts(0)

  const fraction = parts.find((p) => p.type === 'fraction')

  if (!fraction) {
    return 0
  }

  return fraction.value.length
})

const formatCurrency = (value: number): string => {
  return (value / 10 ** decimalPlaces.value).toLocaleString(locale, {
    style: 'currency',
    currency: currencyCode,
    minimumFractionDigits: 0,
  })
}
</script>
