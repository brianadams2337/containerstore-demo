<template>
  <div :title="symbol.label">
    <component
      :is="iconComponentName"
      v-if="iconComponentName"
      :key="symbol.label"
      class="h-5 w-5 md:h-6 md:w-6"
      :alt="symbol.label"
    />
  </div>
</template>

<script setup lang="ts">
import type { Value } from '@scayle/storefront-nuxt'

const props = defineProps({
  symbol: {
    type: Object as PropType<Value>,
    required: true,
  },
})

const { iconComponent } = useCareIcons()
const iconComponentName = computed(() => iconComponent(props.symbol.id))
</script>
