<template>
  <SFButton
    :aria-expanded="isOpen"
    :disabled="disabled"
    variant="raw"
    aria-haspopup="true"
    :aria-controls="listboxButtonAriaId"
    @click="toggleListboxOpen"
  >
    <slot />
  </SFButton>
</template>

<script setup lang="ts">
import { SFButton } from '#storefront-ui/components'

type Props = {
  disabled?: boolean
  listboxButtonAriaId: string
  toggleListboxOpen: () => void
  isOpen: boolean
}

withDefaults(defineProps<Props>(), { disabled: false })
</script>
