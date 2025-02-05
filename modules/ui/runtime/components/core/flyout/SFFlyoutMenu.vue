<template>
  <SFFlyout :is-open="isOpen">
    <div
      id="flyout-menu"
      class="container mx-auto flex max-h-lg w-full flex-nowrap justify-between overflow-y-auto bg-white p-8 shadow-lg"
    >
      <slot />
    </div>
  </SFFlyout>
</template>

<script setup lang="ts">
import { SFFlyout } from '#storefront-ui/components'

const { isOpen = false } = defineProps<{ isOpen?: boolean }>()
</script>
