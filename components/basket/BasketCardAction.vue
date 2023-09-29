<template>
  <AppButton
    no-padding
    v-bind="{ icon, disabled }"
    size="sm"
    type="ghost"
    class="relative !gap-1 text-xs font-bold"
    @click="emit('click')">
    <template #icon="{ _class }">
      <slot name="icon" :_class="_class" />
    </template>
    <slot />
  </AppButton>
</template>

<script setup lang="ts">
defineProps({
  icon: {
    type: String,
    default: '',
  },
  disabled: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits<{
  (e: 'click'): void
}>()
</script>
