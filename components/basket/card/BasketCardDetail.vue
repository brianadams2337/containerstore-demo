<template>
  <div :class="baseClass">
    <div
      class="font-semibold opacity-50"
      :class="labelClass"
      data-testid="main-label"
    >
      {{ label }}
    </div>
    <div
      v-if="value"
      class="font-bold"
      :class="valueClass"
      data-testid="sub-label"
    >
      {{ value }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

type Props = {
  label: string
  value?: string
  primary?: boolean
}

const props = withDefaults(defineProps<Props>(), { value: '', primary: false })

const baseClass = computed(() => {
  return !props.primary
    ? 'flex flex-row items-center gap-2 lg:flex-col lg:items-start lg:gap-0'
    : ''
})

const labelClass = computed(() => (props.primary ? 'text-xs' : 'text-2xs'))
const valueClass = computed(() => (props.primary ? 'text-sm' : 'text-xs'))
</script>
