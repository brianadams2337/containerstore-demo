<template>
  <div>
    <FadeInFromBottomTransition>
      <div
        v-if="isOpen"
        v-bind="$attrs"
        class="absolute left-0 z-30 hidden w-full md:block"
      >
        <FadeInTransition>
          <slot />
        </FadeInTransition>
      </div>
    </FadeInFromBottomTransition>
  </div>
</template>

<script setup lang="ts">
withDefaults(defineProps<{ isOpen?: boolean }>(), { isOpen: false })

defineOptions({ name: 'AppFlyout' })
</script>
