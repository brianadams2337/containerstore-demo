<template>
  <component
    :is="componentName"
    v-bind="{ to, disabled, ...(to && { raw: true }) }"
    :class="{
      'h-[52px] px-6 py-4': !isRaw && isSize('xl'),
      'h-12 px-10': !isRaw && isSize('lg'),
      'h-11 px-10': !isRaw && isSize('md'),
      'h-9 px-6': !isRaw && isSize('sm'),
      'h-8 px-3': !isRaw && isSize('xs'),
      'rounded-xl bg-primary font-semibold text-white outline-none hover:bg-accent':
        isPrimary,
      'rounded-xl border border-gray-300 bg-white font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-600':
        isSecondary,
      'rounded-xl border border-gray-400 bg-transparent font-semibold text-primary hover:bg-secondary-300 hover:text-primary-400':
        isTertiary,
      'rounded-[10px] bg-accent font-semibold text-white hover:bg-accent-600 hover:text-white':
        isAccent,
      'text-primary hover:text-primary-400': isRaw,
      'w-full': isFullWidth,
      'animate-pulse cursor-not-allowed': loading,
      '!rounded-full !p-2': fab,
      uppercase: isUppercase,
      'shadow-secondary': hasShadow && isSecondary,
      'text-sm': (isSize('xs') || isSize('sm')) && !isRaw,
      'text-md': (isSize('md') || isSize('lg') || isSize('xl')) && !isRaw,
    }"
    class="group inline-flex items-center justify-center gap-2 truncate whitespace-nowrap border border-transparent transition duration-100 ease-linear disabled:border-secondary-600 disabled:bg-secondary-200 disabled:text-gray-400"
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
    <slot name="badge" :badge="badge">
      <Transition
        enter-to-class="opacity-100"
        enter-active-class="transition ease-linear duration-200"
        leave-active-class="transition ease-linear duration-200"
        leave-to-class="opacity-0"
      >
        <span v-show="badge">({{ badge }})</span>
      </Transition>
    </slot>
  </component>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { ButtonType, Size, getSizeUtils } from '#storefront-ui'
import type { RouteLocationRaw } from '#vue-router'
import { SFLink } from '#components'

type Props = {
  type?: ButtonType
  size?: Size
  to?: RouteLocationRaw
  badge?: number
  disabled?: boolean
  isFullWidth?: boolean
  loading?: boolean
  animateIcon?: boolean
  fab?: boolean
  isUppercase?: boolean
  hasShadow?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  type: ButtonType.PRIMARY,
  size: Size.MD,
  disabled: false,
  animateIcon: false,
  isFullWidth: false,
  loading: false,
  fab: false,
  isUppercase: false,
  badge: 0,
  to: undefined,
  hasShadow: false,
})

const isPrimary = computed(() => props.type === ButtonType.PRIMARY)
const isSecondary = computed(() => props.type === ButtonType.SECONDARY)
const isTertiary = computed(() => props.type === ButtonType.TERTIARY)
const isRaw = computed(() => props.type === ButtonType.RAW)
const isAccent = computed(() => props.type === ButtonType.ACCENT)

const { isSize } = getSizeUtils(props.size)

const componentName = computed(() => (props.to ? SFLink : 'button'))

const emit = defineEmits<{ click: []; 'click:stop': [] }>()
</script>
