<template>
  <SFButton
    :icon="icon"
    :disabled="disabled"
    no-padding
    size="sm"
    variant="raw"
    class="relative !gap-1 text-xs font-bold"
    @click="emit('click')"
  >
    <template #icon="{ _class }">
      <slot name="icon" :_class="_class" />
    </template>
    <slot />
  </SFButton>
</template>

<script setup lang="ts">
import { SFButton } from '#storefront-ui/components'

type Props = {
  icon?: string
  disabled?: boolean
}

const { icon = '', disabled = false } = defineProps<Props>()

const emit = defineEmits<{ click: [] }>()
</script>
