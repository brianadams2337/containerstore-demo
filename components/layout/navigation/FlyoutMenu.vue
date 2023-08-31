<template>
  <Flyout :is-open="isOpen">
    <div
      id="flyout-menu"
      class="container mx-auto flex max-h-lg w-full flex-nowrap justify-between overflow-y-auto bg-white p-8 shadow-lg">
      <slot />
    </div>
  </Flyout>
</template>

<script setup lang="ts">
defineProps({
  isOpen: {
    type: Boolean,
    default: false,
  },
})
</script>
