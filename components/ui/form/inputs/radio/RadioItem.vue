<template>
  <label
    class="group relative flex cursor-pointer items-center text-sm font-medium"
  >
    <input
      v-model="selected"
      v-bind="{ value, name }"
      type="radio"
      class="absolute left-0 top-0 z-0 opacity-0"
    />
    <div
      class="z-10 inline-flex h-5 w-5 items-center justify-center rounded-full border-2 bg-white"
      :class="isActive ? 'border-primary' : 'border-secondary-700'"
    >
      <span
        v-show="isActive"
        class="inline-block h-2 w-2 rounded-full bg-black"
      />
    </div>
    <span v-if="label" class="ml-2">
      <slot name="label">{{ label }}</slot>
    </span>
  </label>
</template>

<script setup lang="ts" generic="Item extends { label: string; value: any }">
type Props = {
  modelValue?: string | number
  value?: Item['value']
  label?: Item['label']
  name?: string
}
const props = withDefaults(defineProps<Props>(), {
  modelValue: undefined,
  value: undefined,
  label: undefined,
  name: '',
})

const emit = defineEmits(['update:model-value'])

const selected = computed({
  get: () => props.modelValue,
  set: (value?: string | number) => emit('update:model-value', value),
})

const isActive = computed(() => props.modelValue === props.value)
</script>
