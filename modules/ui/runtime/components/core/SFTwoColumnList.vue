<template>
  <ul
    :style="[items.length > 8 ? { columns: 2, 'column-gap': '3.75rem' } : '']"
  >
    <li v-for="(item, idx) in items" :key="`two-column-list-item-${idx}`">
      <slot name="item" :item="item" />
    </li>
  </ul>
</template>

<script setup lang="ts" generic="T">
defineProps<{ items: T[] }>()
</script>
