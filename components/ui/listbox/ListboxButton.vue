<template>
  <AppButton
    :aria-expanded="isOpen"
    :disabled="disabled"
    type="ghost"
    aria-haspopup="true"
    aria-controls="scayle-listbox-options"
    @click="toggle"
  >
    <slot />
  </AppButton>
</template>

<script setup lang="ts">
type Props = {
  listName: string
  disabled?: boolean
}

const props = withDefaults(defineProps<Props>(), { disabled: false })

const { toggle, isOpen } = useListbox(props.listName)
</script>
