<template>
  <div>
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
import {
  SFFadeInTransition,
  SFFadeInFromBottomTransition,
} from '#storefront-ui/components'

const { isOpen = false } = defineProps<{ isOpen?: boolean }>()
</script>
