<template>
  <div class="flex flex-col">
    <legend v-if="title" class="mb-2">{{ title }}</legend>
    <div class="flex items-center">
      <RadioItem
        v-for="item in items"
        :key="item.value"
        v-model="value"
        v-bind="item"
        class="mr-2" />
    </div>
  </div>
</template>

<script setup lang="ts">
export type Item = { label: string; value: string }

const props = defineProps({
  modelValue: {
    type: String as PropType<string>,
    default: undefined,
  },
  items: {
    type: Array as PropType<Item[]>,
    default: undefined,
  },
  title: {
    type: String as PropType<string>,
    default: undefined,
  },
})

const emit = defineEmits(['update:modelValue'])

const value = computed({
  get: () => props.modelValue,
  set: (value: string | undefined) => emit('update:modelValue', value),
})
</script>
