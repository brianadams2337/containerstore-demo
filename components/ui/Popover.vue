<template>
  <div
    class="relative h-full"
    @mouseenter="emit('mouseenter')"
    @mouseleave="emit('mouseleave')">
    <div class="inline-flex h-full w-full items-center justify-center">
      <slot name="action" />
    </div>
    <FadeInFromBottomTransition appear>
      <div
        v-show="!disablePopoverContent && isOpen"
        class="absolute right-0 z-30 min-w-max overflow-hidden">
        <div
          class="overflow-hidden rounded border border-black bg-white"
          :class="contentWrapperClass">
          <slot name="content" />
        </div>
      </div>
    </FadeInFromBottomTransition>
  </div>
</template>

<script setup lang="ts">
defineProps({
  isOpen: {
    type: Boolean as PropType<boolean>,
    default: false,
  },

  disablePopoverContent: {
    type: Boolean as PropType<boolean>,
    default: false,
  },

  contentWrapperClass: {
    type: [String, Object] as PropType<string | object>,
    default: '',
  },
})

const emit = defineEmits<{
  (e: 'mouseenter'): void
  (e: 'mouseleave'): void
}>()
</script>

<script lang="ts">
export default {
  name: 'AppPopover',
}
</script>
