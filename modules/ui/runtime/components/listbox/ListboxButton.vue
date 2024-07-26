<template>
  <SFButton
    :aria-expanded="isOpen"
    :disabled="disabled"
    type="raw"
    aria-haspopup="true"
    aria-controls="scayle-listbox-options"
    @click="toggle"
  >
    <slot />
  </SFButton>
</template>

<script setup lang="ts">
import { useListbox } from '#storefront-ui'

type Props = {
  listName: string
  disabled?: boolean
}

const props = withDefaults(defineProps<Props>(), { disabled: false })

const { toggle, isOpen } = useListbox(props.listName)
</script>
