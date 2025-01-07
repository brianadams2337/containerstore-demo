<template>
  <li
    role="menuitem"
    tabindex="-1"
    @click.capture="handleClick"
    @keydown.enter="handleClick"
  >
    <slot />
  </li>
</template>

<script setup lang="ts" generic="T extends { disabled?: boolean }">
type Props = {
  value?: T
  toggleListboxOpen: () => void
}
const { value = undefined, toggleListboxOpen } = defineProps<Props>()

const handleClick = () => {
  if (!value || ('disabled' in value && value?.disabled)) {
    return
  }
  toggleListboxOpen()
}
</script>
