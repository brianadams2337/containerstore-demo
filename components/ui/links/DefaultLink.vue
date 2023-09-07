<template>
  <NuxtLink
    v-bind="{ openInNewTab, activeClass, exactActiveClass }"
    :to="target"
    :class="variantClass"
    class="inline-flex items-center gap-2 whitespace-nowrap text-xs leading-5 tracking-wide transition duration-200 ease-linear">
    <slot />
    <slot name="badge" :badge="badge">
      <FadeInTransition>
        <span
          v-if="badge"
          :data-badge-content="badge"
          class="rounded-xl bg-black px-2 text-white">
          {{ badge }}
        </span>
      </FadeInTransition>
    </slot>
  </NuxtLink>
</template>

<script setup lang="ts">
import { RouteLocationRaw } from '#vue-router'
import { LinkVariant } from '~/constants'

const LinkTypeClass = {
  [LinkVariant.LOUD]: 'font-bold',
  'extra-loud': 'font-bold uppercase',
  [LinkVariant.NORMAL]: 'font-semibold',
  [LinkVariant.WHISPER]: 'text-gray-700',
  [LinkVariant.QUIETER]: 'text-xs font-medium text-gray-750 tracking-normal',
  [LinkVariant.QUIET]: 'text-sm font-semibold tracking-normal',
} as const

const props = defineProps({
  to: {
    type: [String, Object] as PropType<RouteLocationRaw>,
    required: true,
  },
  badge: {
    type: [Number, String],
    default: undefined,
  },
  onlyExactActive: {
    type: Boolean,
    default: false,
  },
  type: {
    type: String as PropType<LinkVariant>,
    default: LinkVariant.NORMAL,
    validator: (val: LinkVariant) => Object.values(LinkVariant).includes(val),
  },
  openInNewTab: {
    type: Boolean,
    default: false,
  },
  raw: {
    type: Boolean,
    default: false,
  },
})

const ACTIVE_CLASS = '!font-bold'

const variantClass = computed(() => {
  return !props.raw ? LinkTypeClass[props.type] : {}
})

const activeClass = computed(() => (!props.onlyExactActive ? ACTIVE_CLASS : ''))

const exactActiveClass = computed(() => {
  return props.onlyExactActive ? ACTIVE_CLASS : ''
})

const target = computed(() => {
  const isExternal = typeof props.to === 'string' && props.to.startsWith('http')

  return isExternal ? props.to : toLocalePath(props.to)
})
</script>
