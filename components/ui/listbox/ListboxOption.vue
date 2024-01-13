<template>
  <li
    role="option"
    :aria-selected="isActive"
    tabindex="0"
    @click.capture="handleClick"
    @keydown.enter="handleClick"
  >
    <slot :is-active="isActive" />
  </li>
</template>

<script setup lang="ts" generic="T extends { disabled?: boolean }">
type Props = {
  listName: string
  value?: T
}
const props = withDefaults(defineProps<Props>(), { value: undefined })

const { activeValue, setActive, toggle } = useListbox<T>(props.listName)

const handleClick = () => {
  if (!props.value || ('disabled' in props.value && props.value?.disabled)) {
    return
  }
  setActive(props.value as T)
  toggle()
}

const isActive = computed(() => props.value === activeValue.value)
</script>
