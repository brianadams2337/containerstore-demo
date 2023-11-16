<template>
  <div class="flex flex-col">
    <legend v-if="title" class="mb-2">{{ title }}</legend>
    <div class="flex items-center">
      <RadioItem
        v-for="item in items"
        :key="item.value"
        v-model="value"
        v-bind="item"
        class="mr-2"
      />
    </div>
  </div>
</template>

<script setup lang="ts" generic="Item extends { label: string; value: any }">
type Props = {
  modelValue?: any
  items?: Item[]
  title?: string
}
const props = withDefaults(defineProps<Props>(), {
  modelValue: undefined,
  items: undefined,
  title: undefined,
})

const emit = defineEmits(['update:model-value'])

const value = computed({
  get: () => props.modelValue,
  set: (value: string | undefined) => emit('update:model-value', value),
})
</script>
