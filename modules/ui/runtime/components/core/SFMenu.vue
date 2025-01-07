<template>
  <div ref="targetClickOutside">
    <slot>
      <div>
        <slot name="label" :toggle="toggle" />
      </div>
      <div v-if="isOpen" class="absolute z-50" :class="{ 'w-full': fullWidth }">
        <slot name="menuContent" :toggle="toggle" :close="close" />
      </div>
    </slot>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { onClickOutside } from '@vueuse/core'

withDefaults(defineProps<{ fullWidth?: boolean }>(), { fullWidth: false })

const targetClickOutside = ref(null)
const isOpen = ref(false)

const close = () => {
  isOpen.value = false
}

onClickOutside(targetClickOutside, close)

const toggle = () => {
  isOpen.value = !isOpen.value
}
</script>
