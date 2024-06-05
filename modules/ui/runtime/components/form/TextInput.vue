<template>
  <div class="relative flex-1 cursor-text">
    <input
      :id="placeholder"
      ref="input"
      v-model="modelValue"
      v-maska
      :data-maska="dataMaska"
      v-bind="{ required, readonly, type, placeholder, autocomplete }"
      class="w-full rounded border-2 p-3 text-sm font-medium placeholder:text-secondary focus:outline-none focus:ring-0"
      :class="classes"
      :maxlength="maxLength"
    />
    <p v-if="hint" class="mt-1 text-xs">{{ hint }}</p>
  </div>
</template>

<script setup lang="ts">
import { computed, defineModel } from 'vue'
import { vMaska } from 'maska'

type Props = {
  type?: string
  placeholder: string
  autocomplete?: string
  mask?: string | string[]
  required?: boolean
  readonly?: boolean
  maxLength?: number
  hint?: string
  hasErrors?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  type: 'text',
  autocomplete: '',
  mask: '',
  required: false,
  readonly: false,
  maxLength: undefined,
  hint: '',
  hasErrors: false,
})

const modelValue = defineModel<string>()

const dataMaska = computed(() => {
  // Maska don't accept array for the dynamic mask approach.
  // String conversion is needed in order to make it work properly
  return Array.isArray(props.mask) ? JSON.stringify(props.mask) : props.mask
})

const classes = computed(() => [
  modelValue.value ? 'border-primary' : 'border-transparent bg-secondary-450',
  {
    'bg-secondary-450': props.readonly,
    'border-red-500 text-red-500 placeholder:text-red-500 focus:border-red-500':
      props.hasErrors,
  },
])
</script>
