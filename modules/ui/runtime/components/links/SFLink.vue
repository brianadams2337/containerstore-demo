<template>
  <NuxtLink
    :active-class="activeClass"
    :exact-active-class="exactActiveClass"
    :target="target"
    :to="to"
    :class="variantClass"
  >
    <slot />
  </NuxtLink>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { RouteLocationRaw } from '#vue-router'
import { LinkVariant } from '#storefront-ui'
import { NuxtLink } from '#components'

const LinkTypeClass = {
  [LinkVariant.LOUD]: 'font-bold',
  'extra-loud': 'font-bold uppercase',
  [LinkVariant.NORMAL]: 'font-semibold',
  [LinkVariant.WHISPER]: 'text-gray-700 fill-gray-700',
  [LinkVariant.QUIETER]:
    'text-xs font-medium text-gray-750 fill-gray-750 tracking-normal',
  [LinkVariant.QUIET]: 'text-sm font-semibold tracking-normal',
} as const

type Props = {
  to: RouteLocationRaw
  onlyExactActive?: boolean
  variant?: LinkVariant
  raw?: boolean
  target?: '_self' | '_blank' | '_parent' | '_top'
}

const props = withDefaults(defineProps<Props>(), {
  onlyExactActive: false,
  variant: LinkVariant.NORMAL,
  openInNewTab: false,
  raw: false,
  target: '_self',
})

const ACTIVE_CLASS = '!font-bold'

const variantClass = computed(() => {
  const defaultClass = `
    inline-flex items-center gap-2 whitespace-nowrap text-xs
    leading-5 tracking-wide transition duration-200 ease-linear
   `
  return !props.raw ? [defaultClass, LinkTypeClass[props.variant]] : {}
})

const activeClass = computed(() => {
  return !props.onlyExactActive && !props.raw ? ACTIVE_CLASS : ''
})

const exactActiveClass = computed(() => {
  return props.onlyExactActive && !props.raw ? ACTIVE_CLASS : ''
})
</script>
