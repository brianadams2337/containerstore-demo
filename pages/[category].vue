<template>
  <div>Category {{ slug }} Page</div>
</template>

<script setup>
const { params } = useRoute();
const slug = computed(() => params.category);
</script>
