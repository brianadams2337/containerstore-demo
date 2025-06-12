<template>
  <component
    :is="tag"
    data-testid="headline"
    class="flex items-center gap-2 leading-tight"
    :class="[
      HeadlineClass[size],
      isBold ? 'font-bold' : 'font-semibold',
      { uppercase: isUppercase },
    ]"
  >
    <slot />
    <slot :badge="badge" name="badge">
      <span
        v-if="badge"
        class="rounded-full bg-secondary p-1 px-3 text-sm text-gray-300"
      >
        {{ badge }}
      </span>
    </slot>
  </component>
</template>

<script setup lang="ts">
import { HeadlineSize, HeadlineTag } from '#storefront-ui'

const {
  isUppercase = false,
  badge = 0,
  size = HeadlineSize['2XL'],
  tag = HeadlineTag.P,
  isBold = false,
} = defineProps<{
  isUppercase?: boolean
  isBold?: boolean
  badge?: number | string
  size?: HeadlineSize
  tag?: HeadlineTag
}>()

const HeadlineClass = {
  [HeadlineSize['3XL']]: 'text-3xl',
  [HeadlineSize['2XL']]: 'text-2xl',
  [HeadlineSize.XL]: 'text-xl',
  [HeadlineSize.LG]: 'text-lg',
  [HeadlineSize.MD]: 'text-md',
  [HeadlineSize.SM]: 'text-sm',
  [HeadlineSize.XS]: 'text-xs',
} as Record<HeadlineSize, string>
</script>
