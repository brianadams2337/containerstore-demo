<template>
  <div ref="targetClickOutside">
    <slot>
      <div>
        <slot name="label" v-bind="{ toggle }" />
      </div>
      <div v-if="isOpen" class="absolute z-50" :class="{ 'w-full': fullWidth }">
        <slot name="menuContent" v-bind="{ toggle, close }" />
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
