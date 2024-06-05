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
import { computed } from 'vue'
import type { Value } from '@scayle/storefront-nuxt'
import { getCareIconComponent } from '~/utils/careIcons'

const props = defineProps<{ symbol: Value }>()

const iconComponentName = computed(() => getCareIconComponent(props.symbol.id))
</script>
