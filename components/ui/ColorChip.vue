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
      class="absolute inset-x-0 m-auto size-5"
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
import { Size } from '#imports'

const props = defineProps({
  size: {
    type: String as PropType<Size>,
    default: Size.MD,
    validator: (val: Size) => Object.values(Size).includes(val),
  },
  color: {
    type: Object as PropType<ProductColor>,
    required: true,
  },
  isActive: {
    type: Boolean,
    default: false,
  },
  rounded: {
    type: String as PropType<'default' | 'sm' | 'md'>,
    default: 'default',
  },
})

const { isSize } = useUiSize(props.size)

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
  'h-2 w-2': isSize('xs'),
  'h-3 w-3': isSize('sm'),
  'h-4 w-4': isSize('md'),
  'h-6 w-6': isSize('lg'),
  'h-8 w-8': isSize('xl'),
  rounded: props.rounded === 'default',
  'rounded-sm': props.rounded === 'sm',
  '!border-black': hasMixedColors.value,
}))
</script>
