<template>
  <div ref="targetClickOutside">
    <slot>
      <div>
        <slot name="label" v-bind="{ toggle }" />
      </div>
      <div v-if="isOpen" class="absolute z-50" :class="{ 'w-full': fullWidth }">
        <slot name="menu-content" v-bind="{ toggle, close }" />
      </div>
    </slot>
  </div>
</template>

<script setup lang="ts">
const targetClickOutside = ref(null)
const isOpen = ref(false)

const close = () => {
  isOpen.value = false
}

defineProps({
  fullWidth: {
    type: Boolean as PropType<boolean>,
    default: false,
  },
})

onClickOutside(targetClickOutside, close)

const toggle = () => {
  isOpen.value = !isOpen.value
}
</script>
