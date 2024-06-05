<template>
  <div ref="observerElement">
    <slot :stop="stop" />
  </div>
</template>

<script setup lang="ts">
import { defineOptions, ref } from 'vue'
import { useIntersectionObserver } from '@vueuse/core'
import type { PropType } from 'vue'
import type { MaybeComputedElementRef } from '@vueuse/core'
import { pick } from 'radash'

const props = defineProps({
  threshold: {
    type: [Array, Number] as PropType<number[] | number>,
    default: () => [0, 0.2],
  },
  root: {
    type: (typeof HTMLElement !== 'undefined'
      ? HTMLElement
      : Object) as PropType<MaybeComputedElementRef>,
    default: null,
  },
  rootMargin: {
    type: String,
    default: '0px 0px 0px 0px',
  },
})

const observerElement = ref(null)

const emit = defineEmits<{
  (e: 'enter', value: IntersectionObserverEntry, stop: () => void): void
  (e: 'leave', value: IntersectionObserverEntry): void
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
