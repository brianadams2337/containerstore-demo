<template>
  <div>PDP {{ slug }}</div>
</template>

<script setup lang="ts">
const { params } = useRoute()
const slug = computed(() => params.productId)
</script>
