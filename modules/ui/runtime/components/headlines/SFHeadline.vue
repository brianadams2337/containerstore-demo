<template>
  <SFSkeletonLoader v-if="loading" type="headline" />
  <component
    v-bind="$attrs"
    :is="tag"
    v-else
    data-testid="headline"
    class="flex items-center gap-2 leading-tight"
    :class="[
      HeadlineClass[size],
      isBold ? '!font-bold' : 'font-semibold',
      { uppercase: isUppercase, 'visually-hidden': hidden },
    ]"
  >
    <slot />
    <slot :badge="badge" name="badge">
      <SFHeadlineBadge v-if="badge" :badge="badge" />
    </slot>
  </component>
</template>

<script setup lang="ts">
import { HeadlineSize, HeadlineTag } from '#storefront-ui'
import { SFSkeletonLoader, SFHeadlineBadge } from '#storefront-ui/components'

type Props = {
  loading?: boolean
  isUppercase?: boolean
  hidden?: boolean
  isBold?: boolean
  badge?: number | string
  size?: HeadlineSize
  tag?: HeadlineTag
}

withDefaults(defineProps<Props>(), {
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
  [HeadlineSize['3XL']]: 'text-3xl',
  [HeadlineSize['2XL']]: 'text-2xl',
  [HeadlineSize.XL]: 'text-xl',
  [HeadlineSize.LG]: 'text-lg',
  [HeadlineSize.MD]: 'text-base',
  [HeadlineSize.SM]: 'text-sm',
  [HeadlineSize.XS]: 'text-xs',
} as Record<HeadlineSize, string>
</script>
