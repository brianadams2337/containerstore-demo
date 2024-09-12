<template>
  <label
    class="group relative flex cursor-pointer items-center text-sm font-medium"
  >
    <input
      v-model="selected"
      :value="value"
      :name="name"
      :disabled="disabled"
      type="radio"
      class="peer absolute left-0 top-0 z-0 opacity-0"
      :data-testid="`radio-button-${value}`"
    />
    <div
      class="z-10 inline-flex size-5 items-center justify-center rounded-full border-2 bg-white"
      :class="isActive ? 'border-primary' : 'border-secondary-700'"
    >
      <span
        v-show="isActive"
        class="inline-block size-2 rounded-full bg-black"
      />
    </div>
    <span
      v-if="label"
      class="ml-2 peer-disabled:text-secondary-700 peer-disabled:line-through"
    >
      <slot name="label">{{ label }}</slot>
    </span>
  </label>
</template>

<script setup lang="ts" generic="Item extends { label: string; value: any }">
import { computed } from 'vue'

type Props = {
  modelValue?: string | number
  value?: Item['value']
  label?: Item['label']
  name?: string
  disabled?: boolean
}
const props = withDefaults(defineProps<Props>(), {
  modelValue: undefined,
  value: undefined,
  label: undefined,
  name: '',
  disabled: false,
})

const emit = defineEmits<{
  'update:model-value': [string | number | undefined]
}>()

const selected = computed({
  get: () => props.modelValue,
  set: (value?: string | number) => emit('update:model-value', value),
})

const isActive = computed(() => props.modelValue === props.value)
</script>
