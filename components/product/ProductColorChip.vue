<template>
  <SFColorChip
    v-if="colorCode"
    :key="`color-picker-color-${color.value}`"
    :data-color-id="color.id"
    v-bind="{ colorCode, size, isActive, rounded, to }"
  />
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { ProductColor } from '@scayle/storefront-nuxt'
import { getColorCodeById } from '~/utils/product'
import type { ProductColorCode } from '~/utils/product'
import { ColorChipRoundedType, Size } from '#storefront-ui'
import type { RouteLocationRaw } from '#vue-router'

type Props = {
  to?: RouteLocationRaw
  color: ProductColor
  size?: Size
  isActive?: boolean
  rounded?: ColorChipRoundedType
}

const props = withDefaults(defineProps<Props>(), {
  size: Size.MD,
  isActive: false,
  rounded: ColorChipRoundedType.DEFAULT,
  to: undefined,
})

const colorCode = computed<ProductColorCode | undefined>(() => {
  return getColorCodeById(props.color.id)
})
</script>
