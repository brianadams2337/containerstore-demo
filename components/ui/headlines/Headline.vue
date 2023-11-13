<template>
  <SkeletonLoader v-if="loading" type="headline" />
  <component
    :is="tag"
    v-else
    data-test-id="headline"
    class="flex items-center gap-2 font-semibold leading-tight"
    :class="classes"
  >
    <slot />
    <slot :badge="badge" name="badge">
      <HeadlineBadge v-if="badge" :badge="badge" />
    </slot>
  </component>
</template>

<script setup lang="ts">
import { HeadlineSize, HeadlineTag } from '#imports'

type Props = {
  loading?: boolean
  isUppercase?: boolean
  hidden?: boolean
  isBold?: boolean
  badge?: number
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

const sizeClass = computed(() => {
  const size = Object.values(HeadlineSize).find((it) => it === props.size)
  return `text-${size}`
})

const classes = computed(() => [
  sizeClass.value,
  {
    uppercase: props.isUppercase,
    'visually-hidden': props.hidden,
    '!font-bold': props.isBold,
  },
])

defineOptions({ name: 'AppHeadline' })
</script>
