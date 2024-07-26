<template>
  <div ref="observerElement">
    <slot :stop="stop" />
  </div>
</template>

<script setup lang="ts">
import { defineOptions, ref } from 'vue'
import { useIntersectionObserver } from '@vueuse/core'
import type { MaybeComputedElementRef } from '@vueuse/core'
import { pick } from 'radash'

type Props = {
  threshold?: number[] | number
  root?: MaybeComputedElementRef
  rootMargin?: string
}

const props = withDefaults(defineProps<Props>(), {
  threshold: () => [0, 0.2],
  root: null,
  rootMargin: '0px 0px 0px 0px',
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
  pick(props, ['threshold', 'root', 'rootMargin']),
)

defineOptions({ name: 'IntersectionObserver' })
</script>
