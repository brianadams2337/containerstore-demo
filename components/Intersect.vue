<template>
  <component :is="tag" ref="observerElement">
    <slot :stop="stop" />
  </component>
</template>

<script setup lang="ts">
import { defineOptions, ref } from 'vue'
import { useIntersectionObserver } from '@vueuse/core'
import type { MaybeComputedElementRef } from '@vueuse/core'

type Props = {
  threshold?: number[] | number
  root?: MaybeComputedElementRef
  rootMargin?: string
  tag?: string
}

const props = withDefaults(defineProps<Props>(), {
  threshold: () => [0, 0.2],
  root: null,
  rootMargin: '0px 0px 0px 0px',
  tag: 'div',
})

const observerElement = ref(null)

const emit = defineEmits<{
  enter: [IntersectionObserverEntry, () => void]
  leave: [IntersectionObserverEntry]
}>()

const { stop } = useIntersectionObserver(
  observerElement,
  ([observerEntry]) => {
    const { isIntersecting } = observerEntry
    return isIntersecting
      ? emit('enter', observerEntry, stop)
      : emit('leave', observerEntry)
  },
  // Explicitly picking relevant values for intersection observer
  {
    threshold: props.threshold,
    root: props.root,
    rootMargin: props.rootMargin,
  },
)

defineOptions({ name: 'IntersectionObserver' })
</script>
