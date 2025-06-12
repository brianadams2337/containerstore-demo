<template>
  <div
    data-testid="popoverContainer"
    class="relative h-full"
    @mouseenter="$emit('mouseenter')"
    @mouseleave="$emit('mouseleave')"
  >
    <div class="inline-flex size-full items-center justify-center">
      <slot name="action" />
    </div>
    <SFFadeInFromBottomTransition appear>
      <div
        v-if="isOpen"
        class="absolute right-0 z-10 mt-2 hidden min-w-max overflow-hidden bg-clip-content supports-hover:block"
      >
        <div class="overflow-hidden rounded-lg border border-gray-400 bg-white">
          <slot name="content" />
        </div>
      </div>
    </SFFadeInFromBottomTransition>
  </div>
</template>

<script setup lang="ts">
import { SFFadeInFromBottomTransition } from '#storefront-ui/components'

const { isOpen = false } = defineProps<{ isOpen?: boolean }>()

defineEmits<{ mouseenter: []; mouseleave: [] }>()
</script>
