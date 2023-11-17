<template>
  <NuxtLink
    v-bind="{ openInNewTab, activeClass, exactActiveClass, target }"
    :to="resolvedLink"
    :class="variantClass"
  >
    <slot />
    <slot name="badge" :badge="badge">
      <FadeInTransition>
        <span
          v-if="badge"
          :data-badge-content="badge"
          class="rounded-xl bg-black px-2 text-white"
        >
          {{ badge }}
        </span>
      </FadeInTransition>
    </slot>
  </NuxtLink>
</template>

<script setup lang="ts">
import type { RouteLocationRaw } from '#vue-router'
import { LinkVariant } from '#imports'

const LinkTypeClass = {
  [LinkVariant.LOUD]: 'font-bold',
  'extra-loud': 'font-bold uppercase',
  [LinkVariant.NORMAL]: 'font-semibold',
  [LinkVariant.WHISPER]: 'text-gray-700',
  [LinkVariant.QUIETER]: 'text-xs font-medium text-gray-750 tracking-normal',
  [LinkVariant.QUIET]: 'text-sm font-semibold tracking-normal',
} as const

interface DefaultLinkProps {
  to: RouteLocationRaw
  badge?: number | string
  onlyExactActive?: boolean
  type?: LinkVariant
  openInNewTab?: boolean
  raw?: boolean
  target?: '_self' | '_blank' | '_parent' | '_top'
}

const props = withDefaults(defineProps<DefaultLinkProps>(), {
  badge: undefined,
  onlyExactActive: false,
  type: LinkVariant.NORMAL,
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
  return !props.raw ? [defaultClass, LinkTypeClass[props.type]] : {}
})

const activeClass = computed(() => (!props.onlyExactActive ? ACTIVE_CLASS : ''))

const exactActiveClass = computed(() => {
  return props.onlyExactActive ? ACTIVE_CLASS : ''
})

const resolvedLink = computed(() => {
  const isExternal = isString(props.to) && props.to.startsWith('http')

  if (isExternal) {
    return props.to
  }

  if (!isString(props.to)) {
    return toLocalePath(props.to)
  }

  const normalizedPath = !props.to.startsWith('/') ? `/${props.to}` : props.to
  return toLocalePath(normalizedPath)
})
</script>
