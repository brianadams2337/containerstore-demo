<template>
  <div
    class="relative inline-block h-4 w-8 rounded-full transition-colors duration-200 ease-in-out"
    :class="{ 'bg-gray-500': !isActive, 'bg-primary': isActive }">
    <slot name="trigger" :is-active="isActive" @toggle="toggle">
      <button
        class="absolute -mt-1 inline-block h-6 w-6 rounded-full bg-white shadow transition duration-200 ease-linear focus:outline-none"
        :class="{
          'left-0 -ml-2 bg-primary': !isActive,
          'translate-x-4': isActive,
        }"
        role="switch"
        @click="toggle" />
    </slot>
  </div>
</template>

<script setup lang="ts">
const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['update:model-value'])

const isActive = computed({
  get: () => props.modelValue as boolean,
  set: (newValue: boolean) => emit('update:model-value', newValue),
})

const toggle = () => {
  isActive.value = !isActive.value
}
</script>

<script lang="ts">
export default {
  name: 'AppToggle',
}
</script>
