<template>
  <NuxtLink
    :active-class="activeAndExactActiveClass"
    :exact-active-class="activeAndExactActiveClass"
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
  [LinkVariant.WHISPER]: 'text-secondary',
  [LinkVariant.QUIET]: 'text-sm font-semibold tracking-normal',
} as const

const {
  variant = LinkVariant.NORMAL,
  raw = false,
  target = '_self',
} = defineProps<{
  to: RouteLocationRaw
  variant?: LinkVariant
  raw?: boolean
  target?: '_self' | '_blank' | '_parent' | '_top'
}>()

const variantClass = computed(() => {
  const defaultClass = `
    inline-flex items-center gap-2 whitespace-nowrap text-xs
    leading-5 tracking-wide transition duration-200 ease-linear
   `
  return !raw ? [defaultClass, LinkTypeClass[variant]] : {}
})

const activeAndExactActiveClass = computed(() => (!raw ? '!font-bold' : ''))
</script>
