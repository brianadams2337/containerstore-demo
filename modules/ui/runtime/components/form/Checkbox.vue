<template>
  <label
    :for="id"
    class="group flex cursor-pointer items-center space-x-2 text-xs font-medium"
  >
    <input
      :id="id"
      v-model="selected"
      :value="item"
      class="size-5 rounded border border-gray-500 text-black focus:outline-none focus:ring-0"
      :class="{ 'group-hover:bg-gray-200': !isActive }"
      type="checkbox"
    />
    <span>
      <slot name="label">{{ label }}</slot>
    </span>
  </label>
</template>

<script setup lang="ts" generic="T">
import { computed } from 'vue'

// TODO: Refactor and improve this component
type Props = {
  modelValue?: T[]
  item?: T
  id: string
  label: string
}
const props = withDefaults(defineProps<Props>(), {
  modelValue: () => [],
  item: undefined,
  label: undefined,
})

const emit = defineEmits<{ 'update:model-value': [T[]] }>()

const selected = computed({
  get: () => props.modelValue,
  set: (newValue: T[]) => emit('update:model-value', newValue),
})

const isActive = computed(() => {
  return selected.value.findIndex((i: T) => i === props.item) !== -1
})
</script>
