<template>
  <div
    class="relative inline-block h-4 w-8 rounded-full transition-colors duration-200 ease-in-out"
    :class="isActive ? 'bg-primary' : 'bg-gray-500'"
  >
    <slot name="trigger" :is-active="isActive" @toggle="toggle">
      <button
        class="absolute -mt-1 inline-block size-6 rounded-full bg-white shadow transition duration-200 ease-linear focus:outline-none"
        :class="isActive ? 'translate-x-4' : 'left-0 -ml-2 bg-primary'"
        role="switch"
        @click="toggle"
      />
    </slot>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
const props = withDefaults(defineProps<{ modelValue: boolean }>(), {
  modelValue: false,
})

const emit = defineEmits<{ 'update:model-value': [boolean] }>()

const isActive = computed({
  get: () => props.modelValue,
  set: (newValue: boolean) => emit('update:model-value', newValue),
})

const toggle = () => {
  isActive.value = !isActive.value
}
</script>
