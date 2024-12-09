<template>
  <div class="relative flex w-10 flex-col items-center gap-2">
    <div class="group relative">
      <input
        :aria-label="$t('filter.select_color', { color: color.name })"
        :data-color-id="color.id"
        :value="color"
        class="absolute z-20 size-full cursor-pointer appearance-none rounded-lg"
        type="checkbox"
        data-testid="filter-color-chip"
      />
      <div class="relative flex size-10 items-center justify-center">
        <span
          v-if="hasMixedColors"
          class="absolute grid size-full grid-cols-2 overflow-hidden rounded-lg lg:group-hover:border lg:group-hover:border-black lg:group-hover:outline lg:group-hover:outline-2 lg:group-hover:outline-offset-[-3px] lg:group-hover:outline-white"
        >
          <span
            v-for="(hex, index) in colorCode"
            :key="`${index}-${hex}`"
            :style="{ backgroundColor: hex }"
            :class="{
              'last-of-type:col-span-full': isNumberOfMixColorsOdd,
              'border border-gray-400': isBrightColor,
            }"
            class="size-full"
          />
        </span>
        <span
          v-else
          :style="{ backgroundColor: `${colorCode}` }"
          class="absolute size-full rounded-lg lg:group-hover:border lg:group-hover:border-black lg:group-hover:outline lg:group-hover:outline-2 lg:group-hover:outline-offset-[-3px] lg:group-hover:outline-white"
          :class="{ 'border border-gray-400': isBrightColor }"
        />

        <IconCheck
          class="z-10 size-5 text-white opacity-0 lg:group-hover:opacity-100"
          :class="{ '!text-black': isBrightColor, 'opacity-100': isChecked }"
        />
      </div>
    </div>

    <div class="text-center text-sm font-medium text-gray-500">
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import Color from 'color'
import type { AttributesFilterValue } from '@scayle/storefront-api'
import { ProductColor } from '~/constants/product'

type Props = {
  color: AttributesFilterValue
  isChecked?: boolean
}
const props = withDefaults(defineProps<Props>(), { isChecked: false })

const colorCode = computed(() => ProductColor[props.color.value])

const isBrightColor = computed(() => Color(colorCode.value).luminosity() > 0.7)

const hasMixedColors = computed(() => Array.isArray(colorCode.value))

const isNumberOfMixColorsOdd = computed<boolean>(() => {
  if (!hasMixedColors.value || !colorCode.value) {
    return false
  }
  return colorCode.value.length % 2 !== 0
})
</script>
