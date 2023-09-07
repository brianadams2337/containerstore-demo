<template>
  <li
    role="option"
    :aria-selected="isActive"
    tabindex="0"
    @click="handleClick(value)"
    @keydown.enter="handleClick(value)">
    <slot :is-active="isActive" />
  </li>
</template>

<script setup lang="ts" generic="T extends { disabled?: boolean }">

const props = defineProps({
  listName: {
    type: String,
    required: true,
  },
  value: {
    type: Object as PropType<T>,
    default: undefined,
  },
})

const { activeValue, setActive, toggle } = useListbox<T>(props.listName)

const handleClick = (value?: T) => {
  if (!value?.disabled) {
    return
  }
  setActive(value)
  toggle()
}

const isActive = computed(() => props.value === activeValue.value)
</script>
