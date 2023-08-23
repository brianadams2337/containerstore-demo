<template>
  <label
    :for="id"
    class="group flex cursor-pointer items-center space-x-2 text-xs font-medium">
    <input
      :id="id"
      v-model="selected"
      :value="item"
      class="h-5 w-5 rounded border border-gray-500 text-black focus:outline-none focus:ring-0"
      :class="{ 'group-hover:bg-gray-200': !isActive }"
      type="checkbox" />
    <span>
      <slot name="label">{{ label }}</slot>
    </span>
  </label>
</template>

<script setup lang="ts">
// TODO: Refactor and improve this component
const props = defineProps({
  modelValue: {
    type: Array as PropType<object[]>,
    default: () => [],
  },
  item: {
    type: Object as PropType<object>,
    default: undefined,
  },
  id: {
    type: String as PropType<string>,
    required: true,
  },
  label: {
    type: String as PropType<string>,
    default: undefined,
  },
})

const emit = defineEmits(['update:modelValue'])

const selected = computed({
  get: () => props.modelValue as object[],
  set: (newValue: object[]) => emit('update:modelValue', newValue),
})
const isActive = computed(() => {
  return selected.value.findIndex((i: object) => i === props.item) !== -1
})
</script>
