<template>
  <component
    :is="componentName"
    v-bind="{ to, ...(to && { raw: true }) }"
    :class="{
      'h-13 px-6 py-4': !isRaw && isSize('xl'),
      'h-12 px-10': !isRaw && isSize('lg'),
      'h-11 px-10': !isRaw && isSize('md'),
      'h-9 px-6': !isRaw && isSize('sm'),
      'h-8 px-3': !isRaw && isSize('xs'),
      'rounded-xl bg-primary font-semibold text-white hover:bg-accent':
        isPrimary,
      'rounded-xl border border-gray-300 bg-white font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-600':
        isSecondary,
      'rounded-xl border border-gray-400 bg-transparent font-semibold text-primary hover:bg-secondary-300 hover:text-primary-400':
        isTertiary,
      'rounded-10 bg-accent font-semibold text-white hover:bg-accent-600 hover:text-white':
        isAccent,
      'aspect-square bg-white !p-2 text-gray-400 outline-0 transition-transform duration-300 focus-within:shadow-secondary hover:bg-white hover:text-gray-900 focus-visible:shadow-inner-solid-sm disabled:border-transparent disabled:hover:text-gray-400':
        isSlider,
      'text-primary hover:text-primary-400': isRaw,
      'w-full': isFullWidth,
      'animate-pulse cursor-not-allowed': loading,
      '!rounded-full !p-2': fab,
      uppercase: isUppercase,
      'shadow-secondary': hasShadow && isSecondary,
      'text-sm': (isSize('xs') || isSize('sm')) && !isRaw,
      'text-md': (isSize('md') || isSize('lg') || isSize('xl')) && !isRaw,
    }"
    class="group inline-flex items-center justify-center gap-2 truncate whitespace-nowrap transition duration-100 ease-linear disabled:border disabled:border-secondary-600 disabled:bg-secondary-200 disabled:text-gray-400"
    @click.prevent="emit('click')"
    @click.stop="emit('click:stop')"
  >
    <slot
      name="icon"
      :_class="{
        'size-10': isSize('xl'),
        'size-8': isSize('lg'),
        'size-6': isSize('md'),
        'size-4': isSize('sm'),
        'size-3': isSize('xs'),
        'size-2': isSize('4xs'),
        'group-hover:animate-ping-small': animateIcon,
      }"
    />
    <slot />
    <slot
      name="append-icon"
      :_class="{
        'size-10': isSize('xl'),
        'size-8': isSize('lg'),
        'size-6': isSize('md'),
        'size-4': isSize('sm'),
        'size-3': isSize('xs'),
        'size-2': isSize('4xs'),
        'group-hover:animate-ping-small': animateIcon,
      }"
    />
    <slot v-if="badge !== undefined" name="badge" :badge="badge">
      <Transition
        enter-to-class="opacity-100"
        enter-active-class="transition ease-linear duration-200"
        leave-active-class="transition ease-linear duration-200"
        leave-to-class="opacity-0"
        appear
      >
        <span>({{ badge }})</span>
      </Transition>
    </slot>
  </component>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { ButtonVariant, Size, getSizeUtils } from '#storefront-ui'
import type { RouteLocationRaw } from '#vue-router'
import { SFLink } from '#storefront-ui/components'

type Props = {
  variant?: ButtonVariant
  size?: Size
  to?: RouteLocationRaw
  badge?: number
  isFullWidth?: boolean
  loading?: boolean
  animateIcon?: boolean
  fab?: boolean
  isUppercase?: boolean
  hasShadow?: boolean
}

const {
  variant = ButtonVariant.PRIMARY,
  size = Size.MD,
  to,
} = defineProps<Props>()

const isPrimary = computed(() => variant === ButtonVariant.PRIMARY)
const isSecondary = computed(() => variant === ButtonVariant.SECONDARY)
const isTertiary = computed(() => variant === ButtonVariant.TERTIARY)
const isRaw = computed(() => variant === ButtonVariant.RAW)
const isAccent = computed(() => variant === ButtonVariant.ACCENT)
const isSlider = computed(() => variant === ButtonVariant.SLIDER)

const { isSize } = getSizeUtils(size)

const componentName = computed(() => (to ? SFLink : 'button'))

const emit = defineEmits<{ click: []; 'click:stop': [] }>()
</script>
