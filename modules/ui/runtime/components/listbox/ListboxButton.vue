<template>
  <SFButton
    :aria-expanded="isOpen"
    :disabled="disabled"
    variant="raw"
    aria-haspopup="true"
    :aria-controls="id"
    @click="toggle"
  >
    <slot />
  </SFButton>
</template>

<script setup lang="ts">
import { useListbox } from '#storefront-ui'
import { SFButton } from '#storefront-ui/components'

type Props = {
  listName: string
  disabled?: boolean
  id: string
}

const props = withDefaults(defineProps<Props>(), { disabled: false })

const { toggle, isOpen } = useListbox(props.listName)
</script>
