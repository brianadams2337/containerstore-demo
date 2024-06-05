<template>
  <SFSkeletonLoader v-if="loading" type="headline" />
  <component
    :is="tag"
    v-else
    data-test-id="headline"
    class="flex items-center gap-2 font-semibold leading-tight"
    :class="classes"
  >
    <slot />
    <slot :badge="badge" name="badge">
      <SFHeadlineBadge v-if="badge" :badge="badge" />
    </slot>
  </component>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { HeadlineSize, HeadlineTag } from '#storefront-ui'

type Props = {
  loading?: boolean
  isUppercase?: boolean
  hidden?: boolean
  isBold?: boolean
  badge?: number | string
  size?: HeadlineSize
  tag?: HeadlineTag
}

const props = withDefaults(defineProps<Props>(), {
  loading: false,
  isUppercase: false,
  hidden: false,
  badge: 0,
  size: HeadlineSize['2XL'],
  tag: HeadlineTag.P,
  isBold: false,
})

const HeadlineClass = {
  [HeadlineSize['4XL']]: 'text-4xl',
  [HeadlineSize['2XL']]: 'text-2xl',
  [HeadlineSize.XL]: 'text-xl',
  [HeadlineSize.LG]: 'text-lg',
  [HeadlineSize.MD]: 'text-base',
  [HeadlineSize.SM]: 'text-sm',
  [HeadlineSize.XS]: 'text-xs',
} as Record<HeadlineSize, string>

const classes = computed(() => [
  HeadlineClass[props.size],
  {
    uppercase: props.isUppercase,
    'visually-hidden': props.hidden,
    '!font-bold': props.isBold,
  },
])
</script>
