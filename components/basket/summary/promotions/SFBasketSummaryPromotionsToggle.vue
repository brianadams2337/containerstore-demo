<template>
  <SFButton
    variant="raw"
    class="flex items-center !gap-1 !p-0 text-base font-semi-bold-variable leading-3.5 text-gray-600"
    :aria-expanded="visible.toString()"
    @click="visible = !visible"
  >
    {{ $t('basket.discount') }}
    <template #append-icon>
      <IconChevronUp v-if="visible" class="mt-px !size-3.5" />
      <IconChevronDown v-else class="mt-px !size-3.5" />
    </template>
  </SFButton>
</template>

<script setup lang="ts">
import { SFButton } from '#storefront-ui/components'

const visible = defineModel('visible', { type: Boolean, default: false })
</script>
