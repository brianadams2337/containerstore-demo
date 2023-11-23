<template>
  <component
    :is="componentName"
    v-bind="{ to, disabled, ...(to && { raw: true }) }"
    :class="baseClasses"
    class="group inline-flex items-center justify-center gap-2 truncate whitespace-nowrap rounded-md text-sm transition duration-100 ease-linear disabled:opacity-50"
    @click.prevent="emit('click')"
    @click.stop="emit('click:stop')"
  >
    <slot name="icon" :_class="iconClasses" />
    <slot />
    <slot name="append-icon" :_class="iconClasses" />
    <slot name="badge" :badge="badge">
      <transition
        enter-to-class="opacity-100"
        enter-active-class="transition ease-linear duration-200"
        leave-active-class="transition ease-linear duration-200"
        leave-to-class="opacity-0"
      >
        <span v-show="badge" :class="textColorClasses">({{ badge }})</span>
      </transition>
    </slot>
  </component>
</template>

<script setup lang="ts">
import { Size, ButtonType } from '#imports'
import type { RouteLocationRaw } from '#vue-router'

type Props = {
  type?: ButtonType
  size?: Size
  to?: RouteLocationRaw
  badge?: number
  noPadding?: boolean
  disabled?: boolean
  isFullWidth?: boolean
  loading?: boolean
  animateIcon?: boolean
  rounded?: boolean
  fab?: boolean
  isUppercase?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  type: ButtonType.PRIMARY,
  size: Size.MD,
  noPadding: false,
  disabled: false,
  animateIcon: false,
  isFullWidth: false,
  loading: false,
  rounded: false,
  fab: false,
  isUppercase: false,
  badge: 0,
  to: undefined,
})

const isPrimary = computed(() => props.type === ButtonType.PRIMARY)
const isSecondary = computed(() => props.type === ButtonType.SECONDARY)
const isTertiary = computed(() => props.type === ButtonType.TERTIARY)
const isGhost = computed(() => props.type === ButtonType.GHOST)
const isRaw = computed(() => props.type === ButtonType.RAW)

const { isSize } = useUiSize(props.size)

const componentName = computed(() => {
  return props.to ? resolveComponent('DefaultLink') : 'button'
})

const emit = defineEmits<{
  (e: 'click'): void
  (e: 'click:stop'): void
}>()

const baseClasses = computed(() => ({
  'p-3': !props.noPadding && isSize('md'),
  'px-3 py-2': !props.noPadding && isSize('sm'),
  'px-3 py-1.5': !props.noPadding && isSize('xs'),
  'px-0': isRaw.value,
  'px-0 text-primary-400 hover:text-primary': isGhost.value,
  'border border-primary bg-primary font-semibold text-white hover:bg-primary-400':
    isPrimary.value,
  'border bg-secondary-450 font-semibold text-primary hover:bg-secondary-600 hover:text-primary-400':
    isSecondary.value,
  'border border-gray-400 bg-transparent font-semibold text-primary hover:bg-secondary-300 hover:text-primary-400':
    isTertiary.value,
  'w-full': props.isFullWidth,
  'animate-pulse cursor-not-allowed': props.loading,
  '!rounded': props.rounded,
  '!rounded-full': props.fab,
  uppercase: props.isUppercase,
}))

const textColorClasses = computed(() => ({
  'text-white': isPrimary.value,
  'text-primary-100': isSecondary.value,
  'text-primary': isTertiary.value || isGhost.value,
}))

const iconClasses = computed(() => [
  {
    'w-8 h-8': isSize('md'),
    'w-5 h-5': isSize('sm'),
    'w-4 h-4': isSize('xs'),
    'group-hover:animate-ping-small': props.animateIcon,
  },
  textColorClasses,
])
</script>
