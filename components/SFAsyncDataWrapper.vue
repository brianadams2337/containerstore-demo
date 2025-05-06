<template>
  <slot v-if="status === 'success' || (loaded && status !== 'error')" />
  <slot v-else-if="status === 'pending' || status === 'idle'" name="loading" />
  <slot v-else-if="status === 'error'" name="error">
    <slot name="loading" />
  </slot>
</template>

<script setup lang="ts">
import type { AsyncDataRequestStatus } from '#app'

const { loaded = false } = defineProps<{
  status: AsyncDataRequestStatus
  loaded?: boolean
}>()
</script>
