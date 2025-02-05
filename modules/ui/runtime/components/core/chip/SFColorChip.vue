<template>
  <component
    :is="componentName"
    v-bind="{ ...(to && { to, raw: true }) }"
    :style="backgroundColorStyle"
    class="relative col-span-1 flex items-center justify-center overflow-hidden border border-transparent bg-white"
    :class="classes"
  >
    <IconCheckmark
      v-if="isActive"
      class="absolute inset-x-0 m-auto"
      :class="isLightColor ? 'text-primary' : 'text-white'"
    />
    <span v-if="hasMixedColors" class="grid size-full grid-cols-2">
      <span
        v-for="(hex, idx) in colorCode"
        :key="`${idx}-${hex}`"
        :style="{ backgroundColor: hex }"
        :class="{ 'last-of-type:col-span-full': isNumberOfMixColorsOdd }"
        class="size-full"
      />
    </span>
  </component>
</template>

<script setup lang="ts">
import Color from 'color'
import { computed } from 'vue'
import { ColorChipRoundedType, Size, getSizeUtils } from '#storefront-ui'
import type { RouteLocationRaw } from '#vue-router'
import { SFLink } from '#storefront-ui/components'

const {
  colorCode,
  size = Size.MD,
  isActive = false,
  rounded = ColorChipRoundedType.DEFAULT,
  to,
} = defineProps<{
  to?: RouteLocationRaw
  colorCode: string | string[]
  size?: Size
  isActive?: boolean
  rounded?: ColorChipRoundedType
}>()

const { isSize } = getSizeUtils(size)

const componentName = computed(() => (to ? SFLink : 'button'))

const hasMixedColors = computed(() => Array.isArray(colorCode))

const isNumberOfMixColorsOdd = computed<boolean>(() => {
  if (!hasMixedColors.value || !colorCode) {
    return false
  }

  return colorCode.length % 2 !== 0
})

const isLightColor = computed(() => {
  if (hasMixedColors.value) {
    return false
  }
  return Color(colorCode).isLight()
})

// Add gray border for brighter colors
// Reference: https://www.npmjs.com/package/color#luminosity
const hasGrayBorder = computed(() => Color(colorCode).luminosity() > 0.7)

const backgroundColorStyle = computed(() => ({
  backgroundColor: hasMixedColors.value ? 'transparent' : (colorCode as string),
}))

const classes = computed(() => ({
  '!border-gray-500': hasGrayBorder.value,
  'size-2': isSize('xs'),
  'size-3': isSize('sm'),
  'size-4': isSize('md'),
  'size-6': isSize('lg'),
  'size-8': isSize('xl'),
  rounded: rounded === ColorChipRoundedType.DEFAULT,
  'rounded-sm': rounded === ColorChipRoundedType.SM,
  'rounded-md': rounded === ColorChipRoundedType.MD,
  '!border-black': hasMixedColors.value,
}))
</script>
