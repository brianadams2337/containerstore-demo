<template>
  <SkeletonLoader v-if="loading" type="headline" />
  <component
    :is="tag"
    v-else
    data-test-id="headline"
    class="flex items-center gap-2 font-semibold leading-tight"
    :class="classes">
    <slot />
    <slot :badge="badge" name="badge">
      <HeadlineBadge v-if="badge" :badge="badge" />
    </slot>
  </component>
</template>

<script setup lang="ts">
import { HeadlineSize, HeadlineTag } from '~/constants'

const props = defineProps({
  loading: {
    type: Boolean as PropType<boolean>,
    default: false,
  },
  isUppercase: {
    type: Boolean as PropType<boolean>,
    default: false,
  },
  hidden: {
    type: Boolean as PropType<boolean>,
    default: false,
  },
  badge: {
    type: [Number, String] as PropType<number | string>,
    default: 0,
  },
  size: {
    type: String as PropType<HeadlineSize>,
    default: HeadlineSize['2XL'],
    validator: (val: HeadlineSize) => Object.values(HeadlineSize).includes(val),
  },
  tag: {
    type: String as PropType<HeadlineTag>,
    default: HeadlineTag.P,
    validator: (val: HeadlineTag) => Object.values(HeadlineTag).includes(val),
  },
  isBold: {
    type: Boolean as PropType<boolean>,
    default: false,
  },
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
    'font-bold': props.isBold,
  },
])
</script>

<script lang="ts">
export default {
  name: 'AppHeadline',
}
</script>
