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
        v-if="!disablePopoverContent && isOpen"
        class="absolute right-0 z-30 hidden min-w-max overflow-hidden border-t-4 border-transparent bg-clip-content supports-hover:block"
      >
        <div
          class="overflow-hidden rounded-lg border border-gray-300 bg-white"
          :class="contentWrapperClass"
        >
          <slot name="content" />
        </div>
      </div>
    </SFFadeInFromBottomTransition>
  </div>
</template>

<script setup lang="ts">
import { SFFadeInFromBottomTransition } from '#storefront-ui/components'

const {
  isOpen = false,
  disablePopoverContent = false,
  contentWrapperClass = '',
} = defineProps<{
  isOpen?: boolean
  disablePopoverContent?: boolean
  contentWrapperClass?: string | Record<string, boolean>
}>()

defineEmits<{ mouseenter: []; mouseleave: [] }>()
</script>
