<template>
  <div
    class="relative h-full"
    @mouseenter="emit('mouseenter')"
    @mouseleave="emit('mouseleave')"
  >
    <div class="inline-flex size-full items-center justify-center">
      <slot name="action" />
    </div>
    <SFFadeInFromBottomTransition appear>
      <div
        v-show="!disablePopoverContent && isOpen"
        class="absolute right-0 z-30 min-w-max overflow-hidden"
      >
        <div
          class="overflow-hidden rounded border border-black bg-white"
          :class="contentWrapperClass"
        >
          <slot name="content" />
        </div>
      </div>
    </SFFadeInFromBottomTransition>
  </div>
</template>

<script setup lang="ts">
type Props = {
  isOpen?: boolean
  disablePopoverContent?: boolean
  contentWrapperClass?: string | Record<string, boolean>
}

withDefaults(defineProps<Props>(), {
  isOpen: false,
  disablePopoverContent: false,
  contentWrapperClass: '',
})

const emit = defineEmits<{ mouseenter: []; mouseleave: [] }>()
</script>
