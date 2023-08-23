<template>
  <label
    class="group relative flex cursor-pointer items-center text-sm font-medium">
    <input
      v-model="selected"
      :value="value"
      :name="name"
      type="radio"
      class="absolute left-0 top-0 z-0 opacity-0" />
    <div
      class="z-10 inline-flex h-5 w-5 items-center justify-center rounded-full border-2"
      :class="
        isActive
          ? 'border-primary bg-primary'
          : 'border-secondary-700 bg-white '
      ">
      <span
        v-show="isActive"
        class="inline-block h-2 w-2 rounded-full bg-white" />
    </div>
    <span class="ml-2">
      <slot name="label">{{ label }}</slot>
    </span>
  </label>
</template>

<script setup lang="ts">
import { Item } from './RadioGroup.vue'

const props = defineProps({
  modelValue: {
    type: String as PropType<string>,
    default: undefined,
  },
  value: {
    type: String as PropType<Item['value']>,
    default: undefined,
  },
  label: {
    type: String as PropType<Item['label']>,
    default: undefined,
  },
  name: {
    type: String as PropType<string>,
    default: '',
  },
})

const emit = defineEmits(['update:modelValue', 'selectedValue'])

const selected = computed({
  get: () => props.modelValue,
  set: (value: string | undefined) => emit('update:modelValue', value),
})

const isActive = computed(() => props.modelValue?.toString() === props.value)
</script>
