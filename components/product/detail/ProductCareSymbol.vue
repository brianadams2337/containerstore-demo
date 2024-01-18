<template>
  <div :title="symbol.label">
    <component
      :is="iconComponentName"
      v-if="iconComponentName"
      :key="symbol.label"
      :alt="symbol.label"
      class="size-5 md:size-6"
    />
  </div>
</template>

<script setup lang="ts">
import type { Value } from '@scayle/storefront-nuxt'

const props = defineProps<{ symbol: Value }>()

const iconComponentName = computed(() => getCareIconComponent(props.symbol.id))
</script>
