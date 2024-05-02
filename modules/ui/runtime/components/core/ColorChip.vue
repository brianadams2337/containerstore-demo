<template>
  <span
    :key="`color-picker-color-${color.value}`"
    :data-color-id="color.id"
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
  </span>
</template>

<script setup lang="ts">
import type { ProductColor } from '@scayle/storefront-nuxt'
import Color from 'color'
import { computed } from 'vue'
import { Size, getSizeUtils } from '#storefront-ui'

type Props = {
  color: ProductColor
  size?: Size
  isActive?: boolean
  rounded?: 'default' | 'sm' | 'md'
}

const props = withDefaults(defineProps<Props>(), {
  size: Size.MD,
  isActive: false,
  rounded: 'default',
})

const { isSize } = getSizeUtils(props.size)

const colorCode = computed<string | string[]>(() => {
  return getColorCodeForId(props.color.id)
})

const hasMixedColors = computed(() => Array.isArray(colorCode.value))

const isNumberOfMixColorsOdd = computed<boolean>(() => {
  if (!hasMixedColors.value) {
    return false
  }
  return colorCode.value.length % 2 !== 0
})

const isLightColor = computed(() => {
  if (hasMixedColors.value) {
    return false
  }
  return Color(colorCode.value).isLight()
})

const hasGrayBorder = computed(() => {
  return colorCode.value === ColorMap.WHITE.hex || colorCode.value === '#f2efe9'
})

const backgroundColorStyle = computed(() => ({
  backgroundColor: hasMixedColors.value
    ? 'transparent'
    : (colorCode.value as string),
}))

const classes = computed(() => ({
  '!border-gray-500': hasGrayBorder.value,
  'size-2': isSize('xs'),
  'size-3': isSize('sm'),
  'size-4': isSize('md'),
  'size-6': isSize('lg'),
  'size-8': isSize('xl'),
  rounded: props.rounded === 'default',
  'rounded-sm': props.rounded === 'sm',
  '!border-black': hasMixedColors.value,
}))
</script>
