<template>
  <FadeInFromBottomTransition>
    <div
      v-if="isOpen"
      v-bind="$attrs"
      class="absolute left-0 z-30 hidden w-full md:block">
      <FadeInTransition>
        <slot />
      </FadeInTransition>
    </div>
  </FadeInFromBottomTransition>
</template>

<script setup lang="ts">
defineProps({
  isOpen: {
    type: Boolean,
    default: false,
  },
})
</script>

<script lang="ts">
export default {
  name: 'AppFlyout',
}
</script>
