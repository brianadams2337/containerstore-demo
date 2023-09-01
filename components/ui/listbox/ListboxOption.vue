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

<script setup lang="ts">
import { ListboxValue } from '~/types'

const props = defineProps({
  listName: {
    type: String,
    required: true,
  },
  value: {
    type: Object as PropType<ListboxValue>,
    default: undefined,
  },
})

const { activeValue, setActive, toggle } = useListbox(props.listName)

const handleClick = (value?: ListboxValue) => {
  if (!value?.disabled) {
    return
  }
  setActive(value)
  toggle()
}

const isActive = computed(() => props.value === activeValue.value)
</script>
