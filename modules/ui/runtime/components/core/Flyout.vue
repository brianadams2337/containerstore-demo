<template>
  <div data-test-id="flyout-menu">
    <SFFadeInFromBottomTransition>
      <div
        v-if="isOpen"
        v-bind="$attrs"
        class="absolute left-0 z-30 hidden w-full md:block"
      >
        <SFFadeInTransition>
          <slot />
        </SFFadeInTransition>
      </div>
    </SFFadeInFromBottomTransition>
  </div>
</template>

<script setup lang="ts">
withDefaults(defineProps<{ isOpen?: boolean }>(), { isOpen: false })
</script>
