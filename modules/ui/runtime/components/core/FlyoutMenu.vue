<template>
  <SFFlyout :is-open="isOpen">
    <div
      id="flyout-menu"
      class="shadow-lg container mx-auto flex max-h-lg w-full flex-nowrap justify-between overflow-y-auto bg-white p-8"
    >
      <slot />
    </div>
  </SFFlyout>
</template>

<script setup lang="ts">
withDefaults(defineProps<{ isOpen?: boolean }>(), { isOpen: false })
</script>
