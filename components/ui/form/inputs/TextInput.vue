<template>
  <div class="relative flex-1 cursor-text">
    <input
      :id="placeholder"
      ref="input"
      v-model="content"
      v-maska
      :data-maska="dataMaska"
      v-bind="{ required, readonly, type, placeholder, autocomplete }"
      class="w-full rounded border-2 p-3 text-sm font-medium placeholder:text-secondary focus:outline-none focus:ring-0"
      :class="classes"
      :maxlength="maxLength" />
    <p v-if="hint" class="mt-1 text-xs">{{ hint }}</p>
  </div>
</template>

<script setup lang="ts">
import { vMaska } from 'maska'

const props = defineProps({
  modelValue: {
    type: String,
    default: '',
  },
  type: {
    type: String,
    default: 'text',
  },
  placeholder: {
    type: String,
    required: true,
  },
  autocomplete: {
    type: String,
    default: '',
  },
  mask: {
    type: [String, Array] as PropType<string | string[]>,
    default: '',
  },
  required: {
    type: Boolean as PropType<boolean>,
    default: false,
  },
  readonly: {
    type: Boolean as PropType<boolean>,
    default: undefined,
  },
  maxLength: {
    type: Number as PropType<number>,
    default: undefined,
  },
  hint: {
    type: String,
    default: '',
  },
  hasErrors: {
    type: Boolean as PropType<boolean>,
    default: false,
  },
})

const emit = defineEmits(['update:model-value'])

const content = computed({
  get: () => props.modelValue,
  set: (newValue: string): void => emit('update:model-value', newValue),
})

const dataMaska = computed(() => {
  // Maska don't accept array for the dynamic mask approach.
  // String conversion is needed in order to make it work properly
  return Array.isArray(props.mask) ? JSON.stringify(props.mask) : props.mask
})

const classes = computed(() => [
  content.value ? 'border-primary' : 'border-transparent bg-secondary-450',
  {
    'bg-secondary-450': props.readonly,
    'border-red-500 text-red-500 placeholder:text-red-500 focus:border-red-500':
      props.hasErrors,
  },
])
</script>
