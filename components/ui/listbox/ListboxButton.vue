<template>
  <button
    :aria-expanded="isOpen"
    aria-haspopup="true"
    aria-controls="scayle-listbox-options"
    @click="toggle">
    <slot />
  </button>
</template>

<script setup lang="ts">
const props = defineProps({
  listName: { type: String, required: true },
})
const { toggle, isOpen } = useListbox(props.listName)
</script>
