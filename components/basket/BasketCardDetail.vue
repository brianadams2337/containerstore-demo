<template>
  <div
    :class="{
      'flex flex-row items-center gap-2 lg:flex-col lg:items-start lg:gap-0':
        !primary,
    }">
    <div
      class="text-2xs font-semibold opacity-50"
      :class="primary ? 'text-xs' : 'text-2xs'">
      {{ label }}
    </div>
    <div
      v-if="value"
      class="font-bold"
      :class="primary ? 'text-sm' : 'text-xs'">
      {{ value }}
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps({
  label: {
    type: String,
    required: true,
  },
  value: {
    type: String,
    default: '',
  },
  primary: {
    type: Boolean,
    default: false,
  },
})
</script>
