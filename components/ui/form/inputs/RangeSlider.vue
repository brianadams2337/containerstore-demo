<template>
  <div>
    <VueSlider
      v-model="range"
      :enable-cross="false"
      :min="min"
      :max="max"
      contained
      adsorb
      tooltip="none"
      tooltip-placement="bottom"
      :interval="100"
      @change="emit('change')"
      @drag-start="emit('drag-start')"
      @drag-end="emit('drag-end')"
      @dragging="emit('dragging')"
      @error="emit('error')">
      <template #dot>
        <button
          class="flex h-4 w-4 cursor-pointer rounded-full bg-primary focus:outline-none">
          <div class="m-auto h-2 w-2 rounded-full bg-white" />
        </button>
      </template>
    </VueSlider>
    <div class="mt-4 flex items-center">
      <PriceInput
        :model-value="range[0]"
        :min="min"
        :max="modelValue[1]"
        :currency-code="currencyCode"
        :locale="locale"
        :format-options="{
          minimumFractionDigits: 0,
        }"
        @update:model-value="changeRangeAtIndex($event, 0)" />
      <div class="mx-auto text-center text-xs font-semibold text-secondary">
        {{ $t('filter.to') }}
      </div>
      <PriceInput
        :model-value="range[1]"
        :min="modelValue[0]"
        :max="max"
        :currency-code="currencyCode"
        :locale="locale"
        :format-options="{
          minimumFractionDigits: 0,
        }"
        @update:model-value="changeRangeAtIndex($event, 1)" />
    </div>
  </div>
</template>

<script setup lang="ts">
/*
By default vue-slider-component does not support SSR.
We can work around this by importing js and styles separately

https://nightcatsama.github.io/vue-slider-component/#/?hash=server-side-rendering-ssr
*/
// @ts-ignore
import VueSlider from 'vue-slider-component/dist-css/vue-slider-component.umd.min.js'
import 'vue-slider-component/dist-css/vue-slider-component.css'

type RangeTuple = [start: number, end: number]

interface Props {
  modelValue?: RangeTuple
  min?: number
  max?: number
  currencyCode: string
  locale: string
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: () => [3, 29999],
  min: 0,
  max: 100000,
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: RangeTuple): void
  (e: 'change'): void
  (e: 'drag-start'): void
  (e: 'drag-end'): void
  (e: 'dragging'): void
  (e: 'error'): void
}>()

const range = computed({
  get: (): RangeTuple => props.modelValue,
  set: (newValue: RangeTuple) => emit('update:modelValue', newValue),
})

const changeRangeAtIndex = (newRangeValue: number, index: 0 | 1) => {
  const updatedRange = [...range.value]
  updatedRange[index] = newRangeValue
  range.value = updatedRange as RangeTuple
}
</script>

<style lang="scss" src="@/assets/css/slider/default.scss" />
